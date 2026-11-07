export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  institution: string;
  provider: 'google' | 'email';
  joinedAt: string;
  progress: {
    completedModules: string[];
    quizScores: Record<string, number>;
    highestScore: number;
    certificateEarned: boolean;
    certificateId?: string;
    certificateDate?: string;
  };
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}
