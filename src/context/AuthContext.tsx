import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  googleClientId: string;
  setGoogleClientId: (clientId: string) => void;
  loginWithGoogleCredential: (credentialToken: string) => Promise<void>;
  loginWithGoogleDemo: (customGoogleUser?: { name: string; email: string; avatar?: string }) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    institution: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProgress: (moduleId: string, score?: number) => void;
  issueCertificate: () => { certificateId: string; date: string } | null;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'resilia_auth_current_user';
const LOCAL_STORAGE_USERS_DB = 'resilia_registered_users_db';
const LOCAL_STORAGE_GOOGLE_CLIENT_ID = 'resilia_google_client_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [googleClientId, setGoogleClientIdState] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_GOOGLE_CLIENT_ID) || 
      ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string) || '';
  });

  const setGoogleClientId = (clientId: string) => {
    const cleaned = clientId.trim();
    setGoogleClientIdState(cleaned);
    if (cleaned) {
      localStorage.setItem(LOCAL_STORAGE_GOOGLE_CLIENT_ID, cleaned);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_GOOGLE_CLIENT_ID);
    }
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync current user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [user]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Real Google Sign-In with JWT Credential decoding (from accounts.google.com)
  const loginWithGoogleCredential = async (credentialToken: string) => {
    try {
      // Decode JWT Payload
      const base64Url = credentialToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      const fullName = payload.name || payload.given_name || 'Pengguna Google';
      const email = payload.email;
      const avatar = payload.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=1d4ed8`;

      const existingUsers = getRegisteredUsers();
      let matched = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!matched) {
        matched = {
          id: `usr-g-${payload.sub || Date.now()}`,
          name: fullName,
          email: email,
          avatar: avatar,
          role: 'Risk Specialist',
          institution: 'Akun Google Terverifikasi',
          provider: 'google',
          joinedAt: new Date().toISOString(),
          progress: {
            completedModules: ['iso31000-principles'],
            quizScores: {},
            highestScore: 0,
            certificateEarned: false,
          },
        };
        saveRegisteredUsers([...existingUsers, matched]);
      } else {
        // update avatar and name from google
        const updatedUser: UserProfile = { ...matched, avatar, name: fullName };
        matched = updatedUser;
        saveRegisteredUsers(existingUsers.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      }

      setUser(matched);
      closeAuthModal();
    } catch (err) {
      console.error('Failed to parse Google OAuth credential token', err);
      throw new Error('Gagal memverifikasi token Google OAuth.');
    }
  };

  // Demo Google Sign-In fallback
  const loginWithGoogleDemo = async (customGoogleUser?: { name: string; email: string; avatar?: string }) => {
    const fullName = customGoogleUser?.name || 'Praktisi Risiko (Demo)';
    const email = customGoogleUser?.email || 'praktisi.risiko@resiliarisk.web.id';
    const avatar = customGoogleUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=1d4ed8`;

    const existingUsers = getRegisteredUsers();
    let matched = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matched) {
      matched = {
        id: `usr-demo-${Date.now()}`,
        name: fullName,
        email: email,
        avatar: avatar,
        role: 'Risk Specialist',
        institution: 'Simulasi Akun Google',
        provider: 'google',
        joinedAt: new Date().toISOString(),
        progress: {
          completedModules: ['iso31000-principles'],
          quizScores: {},
          highestScore: 0,
          certificateEarned: false,
        },
      };
      saveRegisteredUsers([...existingUsers, matched]);
    }

    setUser(matched);
    closeAuthModal();
  };

  // Login via Email & Password
  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'Email belum terdaftar. Silakan pilih tab Daftar Akun Baru.' };
    }

    // Check password from storage table
    const passTable = JSON.parse(localStorage.getItem('resilia_passwords_db') || '{}');
    if (passTable[cleanEmail] && passTable[cleanEmail] !== pass) {
      return { success: false, error: 'Kata sandi salah. Harap periksa kembali.' };
    }

    setUser(found);
    closeAuthModal();
    return { success: true };
  };

  // Register via Email
  const registerWithEmail = async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    institution: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const users = getRegisteredUsers();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Email sudah terdaftar. Silakan pilih tab Masuk.' };
    }

    const newUser: UserProfile = {
      id: `usr-e-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=047857`,
      role: data.role || 'Risk Officer',
      institution: data.institution.trim() || 'Organisasi Terdaftar',
      provider: 'email',
      joinedAt: new Date().toISOString(),
      progress: {
        completedModules: [],
        quizScores: {},
        highestScore: 0,
        certificateEarned: false,
      },
    };

    // Save user & password
    saveRegisteredUsers([...users, newUser]);
    const passTable = JSON.parse(localStorage.getItem('resilia_passwords_db') || '{}');
    passTable[cleanEmail] = data.password;
    localStorage.setItem('resilia_passwords_db', JSON.stringify(passTable));

    setUser(newUser);
    closeAuthModal();
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  // Mark module complete & record quiz score
  const updateProgress = (moduleId: string, score?: number) => {
    if (!user) return;

    setUser(prev => {
      if (!prev) return null;
      const currentCompleted = prev.progress.completedModules || [];
      const updatedModules = currentCompleted.includes(moduleId)
        ? currentCompleted
        : [...currentCompleted, moduleId];

      const newScores = { ...prev.progress.quizScores };
      let newHighest = prev.progress.highestScore || 0;

      if (score !== undefined) {
        newScores[moduleId] = Math.max(newScores[moduleId] || 0, score);
        newHighest = Math.max(newHighest, score);
      }

      const updatedUser: UserProfile = {
        ...prev,
        progress: {
          ...prev.progress,
          completedModules: updatedModules,
          quizScores: newScores,
          highestScore: newHighest,
        },
      };

      const allUsers = getRegisteredUsers();
      saveRegisteredUsers(allUsers.map(u => (u.id === prev.id ? updatedUser : u)));

      return updatedUser;
    });
  };

  // Issue verified certificate upon passing
  const issueCertificate = () => {
    if (!user) return null;

    const certDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const certId = `RESILIA-ISO31000-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${user.id.slice(-5).toUpperCase()}`;

    const updatedUser: UserProfile = {
      ...user,
      progress: {
        ...user.progress,
        certificateEarned: true,
        certificateId: certId,
        certificateDate: certDate,
      },
    };

    setUser(updatedUser);
    const allUsers = getRegisteredUsers();
    saveRegisteredUsers(allUsers.map(u => (u.id === user.id ? updatedUser : u)));

    return { certificateId: certId, date: certDate };
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = { ...user, ...data };
    setUser(updated);
    const allUsers = getRegisteredUsers();
    saveRegisteredUsers(allUsers.map(u => (u.id === user.id ? updated : u)));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        googleClientId,
        setGoogleClientId,
        loginWithGoogleCredential,
        loginWithGoogleDemo,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateProgress,
        issueCertificate,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper utils
function getRegisteredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: UserProfile[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users database', err);
  }
}
