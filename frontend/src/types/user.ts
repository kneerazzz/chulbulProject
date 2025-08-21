// types/user.ts
export interface User {
  _id: string;
  fullname: string;
  email: string;
  username: string;
  profilePic?: string;
  bio?: string;
  streak: number;
  completedSkills: string[]; // or Skill[] if you have a Skill type
  totalSkills?: number;
  level: number;
  interests: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastCompletedDate?: Date | string | null;
  longestStreak: number;
  createdAt: Date | string;
  achievements: string[];
  notificationPreferences?: {
    email: {
      dailyReminder: boolean;
      weeklyProgress: boolean;
    };
    push: {
      streakReminder: boolean;
    };
  };
}

// types/api.ts
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
}

// types/auth.ts
export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullname: string;
}

// types/profile.ts
export interface UpdateProfileData {
  username?: string;
  fullname?: string;
  bio?: string;
  interests?: string[];
}

export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}