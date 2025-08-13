/**
 * Mock data para notificações
 */

export interface Notification {
  id: string;
  userId: string;
  type:
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'achievement'
    | 'reminder'
    | 'system';
  title: string;
  message: string;
  resourceType?:
    | 'course'
    | 'lesson'
    | 'quiz'
    | 'case'
    | 'discussion'
    | 'announcement';
  resourceId?: string;
  resourceTitle?: string;
  actionUrl?: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category:
    | 'system'
    | 'course'
    | 'social'
    | 'achievement'
    | 'reminder'
    | 'security';
  createdAt: string;
  readAt?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface NotificationSettings {
  email: {
    courseUpdates: boolean;
    achievements: boolean;
    reminders: boolean;
    social: boolean;
    system: boolean;
  };
  push: {
    courseUpdates: boolean;
    achievements: boolean;
    reminders: boolean;
    social: boolean;
    system: boolean;
  };
  inApp: {
    courseUpdates: boolean;
    achievements: boolean;
    reminders: boolean;
    social: boolean;
    system: boolean;
  };
}

// Mock data storage
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'reminder',
    title: '🔔 Masterclass em 1 hora!',
    message: 'A masterclass "Deep Plane Facelift: Técnicas Avançadas" começa às 20:00. Prepare-se!',
    resourceType: 'course',
    resourceId: '1',
    resourceTitle: 'Deep Plane Facelift',
    actionUrl: '/calendar',
    isRead: false,
    priority: 'urgent',
    category: 'reminder',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 min ago
  },
  {
    id: '2',
    userId: '1',
    type: 'info',
    title: 'Novo caso clínico disponível',
    message: 'Dr. Lucas Martins compartilhou: "Mamoplastia de Aumento com Prótese de Silicone"',
    resourceType: 'case',
    resourceId: '12',
    resourceTitle: 'Mamoplastia de Aumento',
    actionUrl: '/cases/12',
    isRead: false,
    priority: 'medium',
    category: 'social',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    userId: '1',
    type: 'success',
    title: 'Certificado disponível!',
    message: 'Parabéns! Seu certificado do curso "EndoBrowlift & EndomidFace" está pronto.',
    resourceType: 'course',
    resourceId: '2',
    resourceTitle: 'EndoBrowlift & EndomidFace',
    actionUrl: '/academy/2',
    isRead: false,
    priority: 'high',
    category: 'achievement',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: '4',
    userId: '1',
    type: 'info',
    title: 'Comentário no seu caso',
    message: 'Dra. Ana Couto comentou no caso "Rinoplastia Secundária"',
    resourceType: 'case',
    resourceId: '8',
    resourceTitle: 'Rinoplastia Secundária',
    actionUrl: '/cases/8',
    isRead: true,
    priority: 'low',
    category: 'social',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: '5',
    userId: '1',
    type: 'warning',
    title: 'Prazo da mentoria expirando',
    message: 'Sua mentoria "Cirurgia Plástica Avançada" expira em 7 dias. Renove para continuar.',
    resourceType: 'course',
    resourceId: '3',
    resourceTitle: 'Cirurgia Plástica Avançada',
    actionUrl: '/academy/3',
    isRead: false,
    priority: 'high',
    category: 'system',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '6',
    userId: '1',
    type: 'reminder',
    title: 'Live amanhã às 19h',
    message: 'Não esqueça! Live exclusiva sobre "Técnicas de Sutura em Blefaroplastia"',
    actionUrl: '/calendar',
    isRead: true,
    priority: 'medium',
    category: 'reminder',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
];

export const defaultNotificationSettings: NotificationSettings = {
  email: {
    courseUpdates: true,
    achievements: true,
    reminders: true,
    social: false,
    system: true,
  },
  push: {
    courseUpdates: true,
    achievements: true,
    reminders: true,
    social: false,
    system: false,
  },
  inApp: {
    courseUpdates: true,
    achievements: true,
    reminders: true,
    social: true,
    system: true,
  },
};

// Helper functions
export function getNotificationsByUser(userId: string): Notification[] {
  return mockNotifications.filter(n => n.userId === userId);
}

export function addNotification(
  notification: Omit<Notification, 'id' | 'createdAt'>
): Notification {
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  mockNotifications.unshift(newNotification);
  return newNotification;
}

export function markNotificationAsRead(id: string): boolean {
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.isRead = true;
    notification.readAt = new Date().toISOString();
    return true;
  }
  return false;
}

export function deleteNotification(id: string): boolean {
  const index = mockNotifications.findIndex(n => n.id === id);
  if (index !== -1) {
    mockNotifications.splice(index, 1);
    return true;
  }
  return false;
}

export function getNotificationStats(userId: string): NotificationStats {
  const userNotifications = getNotificationsByUser(userId);

  const stats: NotificationStats = {
    total: userNotifications.length,
    unread: userNotifications.filter(n => !n.isRead).length,
    byCategory: {},
    byPriority: {},
  };

  userNotifications.forEach(notification => {
    // Count by category
    stats.byCategory[notification.category] =
      (stats.byCategory[notification.category] || 0) + 1;

    // Count by priority
    stats.byPriority[notification.priority] =
      (stats.byPriority[notification.priority] || 0) + 1;
  });

  return stats;
}
export function markAllAsRead(userId: string): boolean {
  const userNotifications = getNotificationsByUser(userId);
  let updated = false;

  userNotifications.forEach(notification => {
    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date().toISOString();
      updated = true;
    }
  });

  return updated;
}

export function getNotificationsByCategory(
  userId: string,
  category: string
): Notification[] {
  return getNotificationsByUser(userId).filter(n => n.category === category);
}

export function getUnreadNotifications(userId: string): Notification[] {
  return getNotificationsByUser(userId).filter(n => !n.isRead);
}
