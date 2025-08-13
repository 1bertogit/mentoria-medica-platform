export interface UserProfile {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  specialty?: string;
  location?: string;
  website?: string;
  phoneNumber?: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  emailVerified: boolean;
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      weekly: boolean;
      marketing: boolean;
      updates: boolean;
    };
    appearance: {
      theme: 'light' | 'dark' | 'system';
      language: 'pt' | 'en' | 'es';
      timezone: string;
      compactMode: boolean;
    };
    privacy: {
      profileVisible: boolean;
      showEmail: boolean;
      showPhone: boolean;
      allowMessages: boolean;
    };
  };
  stats?: {
    casesShared: number;
    articlesRead: number;
    classesAttended: number;
    eventsJoined: number;
  };
}

export interface UpdateProfileData {
  name?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  specialty?: string;
  location?: string;
  website?: string;
  phoneNumber?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  weekly: boolean;
  marketing: boolean;
  updates: boolean;
}

export interface AppearancePreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt' | 'en' | 'es';
  timezone: string;
  compactMode: boolean;
}