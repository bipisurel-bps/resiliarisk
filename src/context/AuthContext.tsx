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
  loginWithDemoBps: () => Promise<void>;
  logout: () => void;
  updateProgress: (moduleId: string, score?: number) => void;
  issueCertificate: () => { certificateId: string; date: string } | null;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'resilia_auth_current_user';
const LOCAL_STORAGE_USERS_DB = 'resilia_registered_users_db';
const LOCAL_STORAGE_PASSWORDS_DB = 'resilia_passwords_db';
const LOCAL_STORAGE_GOOGLE_CLIENT_ID = 'resilia_google_client_id';
export const OFFICIAL_GOOGLE_CLIENT_ID = '403568040979-csg7qi9dc7vumpu6beklufj6699g524u.apps.googleusercontent.com';

export const DEMO_BPS_USER: UserProfile = {
  id: 'usr-bps-official',
  name: 'Budi Raharja, S.Si',
  email: 'analis.risiko@bps.go.id',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Budi%20Raharja&backgroundColor=047857',
  role: 'Risk Officer / Analis Risiko',
  institution: 'Badan Pusat Statistik (BPS)',
  provider: 'email',
  joinedAt: '2026-01-15T08:00:00.000Z',
  progress: {
    completedModules: ['iso31000-principles', 'iso31000-framework', 'three-lines-model', 'iso-31000-exam'],
    quizScores: { 'iso-31000-exam': 9 },
    highestScore: 9,
    certificateEarned: true,
    certificateId: 'RESILIA-ISO31000-202602-BPS01',
    certificateDate: '10 Februari 2026',
  },
};

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
      ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string) || 
      OFFICIAL_GOOGLE_CLIENT_ID;
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

  // Helper to merge pending quiz result if candidate took exam prior to logging in
  const applyPendingQuizResult = (baseProgress: UserProfile['progress']): UserProfile['progress'] => {
    const nextProgress = { ...baseProgress };
    try {
      const pendingRaw = localStorage.getItem('resilia_pending_quiz_result');
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw);
        if (typeof pending.score === 'number') {
          nextProgress.quizScores = {
            ...nextProgress.quizScores,
            'iso-31000-exam': Math.max(nextProgress.quizScores?.['iso-31000-exam'] || 0, pending.score),
          };
          nextProgress.highestScore = Math.max(nextProgress.highestScore || 0, pending.score);
          if (pending.score >= 7 && !nextProgress.certificateEarned) {
            nextProgress.certificateEarned = true;
            nextProgress.certificateDate = new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            nextProgress.certificateId = `RESILIA-ISO31000-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(10000 + Math.random() * 90000))}`;
          }
        }
      }
    } catch (e) {
      console.warn('Pending quiz parse warning:', e);
    }
    return nextProgress;
  };

  // Real Google Sign-In with JWT Credential decoding (from accounts.google.com)
  const loginWithGoogleCredential = async (credentialToken: string) => {
    try {
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
          progress: applyPendingQuizResult({
            completedModules: ['iso31000-principles'],
            quizScores: {},
            highestScore: 0,
            certificateEarned: false,
          }),
        };
        saveRegisteredUsers([...existingUsers, matched]);
      } else {
        const updatedUser: UserProfile = { 
          ...matched, 
          avatar, 
          name: fullName,
          progress: applyPendingQuizResult(matched.progress),
        };
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
    const fullName = customGoogleUser?.name || 'Praktisi Risiko (Google)';
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
        progress: applyPendingQuizResult({
          completedModules: ['iso31000-principles'],
          quizScores: {},
          highestScore: 0,
          certificateEarned: false,
        }),
      };
      saveRegisteredUsers([...existingUsers, matched]);
    } else {
      matched = {
        ...matched,
        progress: applyPendingQuizResult(matched.progress),
      };
    }

    setUser(matched);
    closeAuthModal();
  };

  // Login via Email & Password (Supports ANY domain: @bps.go.id, @kemenkeu.go.id, @company.com, etc.)
  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { 
        success: false, 
        error: `Email "${cleanEmail}" belum terdaftar. Silakan pilih tab "Daftar Akun Baru" untuk mendaftar.` 
      };
    }

    // Check password from storage table
    const passTable = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PASSWORDS_DB) || '{}');
    if (passTable[cleanEmail] && passTable[cleanEmail] !== pass) {
      return { success: false, error: 'Kata sandi tidak sesuai. Harap periksa kembali huruf besar/kecil.' };
    }

    // Check and apply pending quiz result
    const updatedUser = {
      ...found,
      progress: applyPendingQuizResult(found.progress),
    };

    saveRegisteredUsers(users.map(u => (u.id === found.id ? updatedUser : u)));
    setUser(updatedUser);
    closeAuthModal();
    return { success: true };
  };

  // Register via Email (Works for ANY non-Gmail & government domain)
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
      return { success: false, error: 'Email ini sudah terdaftar. Silakan pilih tab "Masuk" untuk melanjutkan.' };
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
      progress: applyPendingQuizResult({
        completedModules: ['iso31000-principles'],
        quizScores: {},
        highestScore: 0,
        certificateEarned: false,
      }),
    };

    // Save user & password
    saveRegisteredUsers([...users, newUser]);
    const passTable = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PASSWORDS_DB) || '{}');
    passTable[cleanEmail] = data.password;
    localStorage.setItem(LOCAL_STORAGE_PASSWORDS_DB, JSON.stringify(passTable));

    setUser(newUser);
    closeAuthModal();
    return { success: true };
  };

  // 1-Click BPS Demo Login for instant non-Gmail testing
  const loginWithDemoBps = async () => {
    const users = getRegisteredUsers();
    let bpsUser = users.find(u => u.email.toLowerCase() === DEMO_BPS_USER.email.toLowerCase());

    if (!bpsUser) {
      bpsUser = DEMO_BPS_USER;
      saveRegisteredUsers([...users, bpsUser]);
      const passTable = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PASSWORDS_DB) || '{}');
      passTable[DEMO_BPS_USER.email.toLowerCase()] = 'resilia123';
      localStorage.setItem(LOCAL_STORAGE_PASSWORDS_DB, JSON.stringify(passTable));
    }

    setUser(bpsUser);
    closeAuthModal();
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
        loginWithDemoBps,
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
    if (!raw) {
      // Seed default BPS demo user for instant testing
      const defaultList = [DEMO_BPS_USER];
      localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(defaultList));
      const passTable = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PASSWORDS_DB) || '{}');
      if (!passTable[DEMO_BPS_USER.email.toLowerCase()]) {
        passTable[DEMO_BPS_USER.email.toLowerCase()] = 'resilia123';
        localStorage.setItem(LOCAL_STORAGE_PASSWORDS_DB, JSON.stringify(passTable));
      }
      return defaultList;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [DEMO_BPS_USER];
  }
}

function saveRegisteredUsers(users: UserProfile[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users database', err);
  }
}
