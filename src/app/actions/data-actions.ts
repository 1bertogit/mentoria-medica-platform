'use server';

import type { UserProfile, UpdateProfileData, NotificationPreferences, AppearancePreferences } from '@/lib/aws/users';
import { initialMedicalCases, type MedicalCase } from '@/lib/mock-data/cases';

// Mock current user data
const mockUser: UserProfile = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  firstName: 'Admin',
  lastName: 'User',
  avatarUrl: '',
  bio: 'Healthcare professional specializing in medical procedures',
  specialty: 'General Medicine',
  location: 'São Paulo, Brazil',
  website: 'https://example.com',
  phoneNumber: '+55 11 99999-9999',
  role: 'admin',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  lastLogin: new Date(),
  isActive: true,
  emailVerified: true,
  preferences: {
    notifications: {
      email: true,
      push: true,
      weekly: true,
      marketing: false,
      updates: true
    },
    appearance: {
      theme: 'light',
      language: 'pt',
      timezone: 'America/Sao_Paulo',
      compactMode: false
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      allowMessages: true
    }
  },
  stats: {
    casesShared: 15,
    articlesRead: 42,
    classesAttended: 8,
    eventsJoined: 5
  }
};

export async function getCurrentUserAction(): Promise<UserProfile> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would fetch from your database
  return mockUser;
}

export async function updateProfileAction(data: UpdateProfileData): Promise<UserProfile> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock update - in a real app, this would update the database
  const updatedUser: UserProfile = {
    ...mockUser,
    ...data,
    updatedAt: new Date()
  };
  
  return updatedUser;
}

export async function uploadAvatarAction(file: File): Promise<string> {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock avatar URL - in a real app, this would upload to S3 or similar
  const mockAvatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mockUser.name)}`;
  
  return mockAvatarUrl;
}

export async function updateNotificationPreferencesAction(
  notifications: NotificationPreferences
): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock update - in a real app, this would update the database
  mockUser.preferences.notifications = notifications;
  mockUser.updatedAt = new Date();
}

export async function updateAppearancePreferencesAction(
  appearance: AppearancePreferences
): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock update - in a real app, this would update the database
  mockUser.preferences.appearance = appearance;
  mockUser.updatedAt = new Date();
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation - in a real app, this would verify the current password
  if (currentPassword !== 'password') {
    throw new Error('Senha atual incorreta');
  }
  
  if (newPassword.length < 8) {
    throw new Error('A nova senha deve ter pelo menos 8 caracteres');
  }
  
  // Mock password change - in a real app, this would hash and store the new password
  return true;
}

export async function logoutAction(): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock logout - in a real app, this would invalidate tokens, clear sessions, etc.
  return;
}

export async function getCasesAction(): Promise<MedicalCase[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would fetch from DynamoDB
  return initialMedicalCases;
}