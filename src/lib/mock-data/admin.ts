import type { User } from '@/types';
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'user' | 'premium';
  specialty?: string;
  title?: string;
  status: 'active' | 'inactive' | 'banned' | 'pending';
  createdAt: string;
  lastLoginAt?: string;
  stats: {
    casesSubmitted: number;
    commentsPosted: number;
    coursesCompleted: number;
    reputationScore: number;
  };
  subscription?: {
    type: 'free' | 'basic' | 'premium' | 'enterprise';
    expiresAt?: string;
    features: string[];
  };
}

export interface ContentModerationItem {
  id: string;
  type: 'case' | 'comment' | 'discussion' | 'article';
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  submittedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  flags: {
    type: 'spam' | 'inappropriate' | 'copyright' | 'medical_accuracy' | 'other';
    count: number;
    details?: string;
  }[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface SystemMetrics {
  users: {
    total: number;
    active: number;
    new: number;
    premium: number;
  };
  content: {
    cases: number;
    articles: number;
    comments: number;
    discussions: number;
  };
  engagement: {
    dailyActiveUsers: number;
    averageSessionTime: number;
    pageViews: number;
    commentRate: number;
  };
  moderation: {
    pendingReviews: number;
    resolvedToday: number;
    flaggedContent: number;
    averageResponseTime: number;
  };
}

export interface ActivityLog {
  id: string;
  type: 'user_action' | 'system_event' | 'moderation' | 'security';
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  details?: unknown;
  userId?: string;
  userName?: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

export interface PlatformSettings {
  id: string;
  category: 'general' | 'security' | 'moderation' | 'notifications' | 'content';
  name: string;
  description: string;
  value: unknown;
  type: 'boolean' | 'string' | 'number' | 'array' | 'object';
  lastModified: string;
  modifiedBy: string;
}

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Ana Silva',
    email: 'ana.silva@mentoriamedica.com',
    avatar: '/avatars/ana-silva.jpg',
    role: 'admin',
    specialty: 'Rinoplastia',
    title: 'Cirurgiã Plástica',
    status: 'active',
    createdAt: '2023-01-15T10:00:00Z',
    lastLoginAt: '2024-01-20T14:30:00Z',
    stats: {
      casesSubmitted: 45,
      commentsPosted: 128,
      coursesCompleted: 12,
      reputationScore: 2840
    },
    subscription: {
      type: 'enterprise',
      features: ['unlimited_cases', 'priority_support', 'advanced_analytics']
    }
  },
  {
    id: '2',
    name: 'Dr. Carlos Mendes',
    email: 'carlos.mendes@gmail.com',
    avatar: '/avatars/carlos-mendes.jpg',
    role: 'moderator',
    specialty: 'Dermatologia',
    title: 'Dermatologista',
    status: 'active',
    createdAt: '2023-02-20T09:15:00Z',
    lastLoginAt: '2024-01-20T08:45:00Z',
    stats: {
      casesSubmitted: 32,
      commentsPosted: 95,
      coursesCompleted: 8,
      reputationScore: 1950
    },
    subscription: {
      type: 'premium',
      expiresAt: '2024-12-31T23:59:59Z',
      features: ['advanced_search', 'priority_comments', 'exclusive_content']
    }
  },
  {
    id: '3',
    name: 'Dr. Marina Costa',
    email: 'marina.costa@outlook.com',
    avatar: '/avatars/marina-costa.jpg',
    role: 'user',
    specialty: 'Mamoplastia',
    title: 'Cirurgiã Plástica',
    status: 'active',
    createdAt: '2023-03-10T16:20:00Z',
    lastLoginAt: '2024-01-19T19:20:00Z',
    stats: {
      casesSubmitted: 28,
      commentsPosted: 67,
      coursesCompleted: 5,
      reputationScore: 1420
    },
    subscription: {
      type: 'basic',
      expiresAt: '2024-06-30T23:59:59Z',
      features: ['basic_search', 'standard_support']
    }
  },
  {
    id: '4',
    name: 'Dr. Roberto Lima',
    email: 'roberto.lima@yahoo.com',
    avatar: '/avatars/roberto-lima.jpg',
    role: 'user',
    specialty: 'Lifting Facial',
    title: 'Cirurgião Plástico',
    status: 'pending',
    createdAt: '2024-01-18T11:30:00Z',
    stats: {
      casesSubmitted: 2,
      commentsPosted: 8,
      coursesCompleted: 0,
      reputationScore: 50
    },
    subscription: {
      type: 'free',
      features: ['limited_access']
    }
  },
  {
    id: '5',
    name: 'Dr. Juliana Santos',
    email: 'juliana.santos@hotmail.com',
    avatar: '/avatars/juliana-santos.jpg',
    role: 'user',
    specialty: 'Preenchimentos',
    title: 'Medicina Estética',
    status: 'banned',
    createdAt: '2023-08-05T14:15:00Z',
    lastLoginAt: '2024-01-10T10:20:00Z',
    stats: {
      casesSubmitted: 15,
      commentsPosted: 89,
      coursesCompleted: 3,
      reputationScore: 890
    },
    subscription: {
      type: 'basic',
      expiresAt: '2024-08-05T23:59:59Z',
      features: ['basic_search']
    }
  }
];

// Mock Content Moderation Data
export const mockModerationQueue: ContentModerationItem[] = [
  {
    id: 'mod-1',
    type: 'case',
    title: 'Rinoplastia Complexa com Complicações',
    content: 'Caso de rinoplastia primária com complicações pós-operatórias...',
    author: {
      id: '4',
      name: 'Dr. Roberto Lima',
      email: 'roberto.lima@yahoo.com'
    },
    status: 'pending',
    submittedAt: '2024-01-20T10:30:00Z',
    flags: [
      {
        type: 'medical_accuracy',
        count: 2,
        details: 'Possível imprecisão na descrição da técnica cirúrgica'
      }
    ],
    priority: 'high'
  },
  {
    id: 'mod-2',
    type: 'comment',
    title: 'Comentário em "Mamoplastia de Aumento"',
    content: 'Discordo completamente desta abordagem. Na minha experiência...',
    author: {
      id: '5',
      name: 'Dr. Juliana Santos',
      email: 'juliana.santos@hotmail.com'
    },
    status: 'flagged',
    submittedAt: '2024-01-19T15:45:00Z',
    flags: [
      {
        type: 'inappropriate',
        count: 3,
        details: 'Linguagem agressiva e não construtiva'
      }
    ],
    priority: 'medium'
  },
  {
    id: 'mod-3',
    type: 'discussion',
    title: 'Novos Equipamentos para Consultório',
    content: 'Gostaria de compartilhar minha experiência com equipamentos...',
    author: {
      id: '3',
      name: 'Dr. Marina Costa',
      email: 'marina.costa@outlook.com'
    },
    status: 'approved',
    submittedAt: '2024-01-18T09:20:00Z',
    moderatedAt: '2024-01-18T14:30:00Z',
    moderatedBy: 'Dr. Carlos Mendes',
    flags: [],
    priority: 'low'
  }
];

// Mock System Metrics
export const mockSystemMetrics: SystemMetrics = {
  users: {
    total: 2847,
    active: 1923,
    new: 156,
    premium: 489
  },
  content: {
    cases: 1234,
    articles: 567,
    comments: 8901,
    discussions: 345
  },
  engagement: {
    dailyActiveUsers: 456,
    averageSessionTime: 18.5,
    pageViews: 12847,
    commentRate: 0.23
  },
  moderation: {
    pendingReviews: 23,
    resolvedToday: 45,
    flaggedContent: 12,
    averageResponseTime: 4.2
  }
};

// Mock Activity Logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    type: 'moderation',
    severity: 'info',
    message: 'Conteúdo aprovado na moderação',
    details: { contentId: 'mod-3', action: 'approved' },
    userId: '2',
    userName: 'Dr. Carlos Mendes',
    timestamp: '2024-01-20T14:30:00Z',
    ip: '192.168.1.100'
  },
  {
    id: 'log-2',
    type: 'user_action',
    severity: 'warning',
    message: 'Tentativa de login com credenciais inválidas',
    userId: '5',
    userName: 'Dr. Juliana Santos',
    timestamp: '2024-01-20T13:15:00Z',
    ip: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'log-3',
    type: 'system_event',
    severity: 'info',
    message: 'Backup automático concluído com sucesso',
    timestamp: '2024-01-20T02:00:00Z',
    details: { backupSize: '2.3GB', duration: '45 minutes' }
  },
  {
    id: 'log-4',
    type: 'security',
    severity: 'critical',
    message: 'Tentativa de acesso não autorizado detectada',
    timestamp: '2024-01-19T23:45:00Z',
    ip: '192.168.1.200',
    details: { endpoint: '/admin/users', attempts: 5 }
  }
];

// Mock Platform Settings
export const mockPlatformSettings: PlatformSettings[] = [
  {
    id: 'set-1',
    category: 'general',
    name: 'platform_name',
    description: 'Nome da plataforma',
    value: 'Mentoria Médica',
    type: 'string',
    lastModified: '2024-01-15T10:00:00Z',
    modifiedBy: 'Dr. Ana Silva'
  },
  {
    id: 'set-2',
    category: 'security',
    name: 'max_login_attempts',
    description: 'Máximo de tentativas de login',
    value: 5,
    type: 'number',
    lastModified: '2024-01-10T14:30:00Z',
    modifiedBy: 'Dr. Ana Silva'
  },
  {
    id: 'set-3',
    category: 'moderation',
    name: 'auto_approve_trusted_users',
    description: 'Aprovação automática para usuários confiáveis',
    value: true,
    type: 'boolean',
    lastModified: '2024-01-08T16:45:00Z',
    modifiedBy: 'Dr. Carlos Mendes'
  },
  {
    id: 'set-4',
    category: 'content',
    name: 'max_case_images',
    description: 'Máximo de imagens por caso clínico',
    value: 10,
    type: 'number',
    lastModified: '2024-01-05T09:20:00Z',
    modifiedBy: 'Dr. Ana Silva'
  }
];

// Helper Functions
export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}

export function getUsersByRole(role: string): User[] {
  return mockUsers.filter(user => user.role === role);
}

export function getUsersByStatus(status: string): User[] {
  return mockUsers.filter(user => user.status === status);
}

export function getModerationItemsByStatus(status: string): ContentModerationItem[] {
  return mockModerationQueue.filter(item => item.status === status);
}

export function getActivityLogsByType(type: string): ActivityLog[] {
  return mockActivityLogs.filter(log => log.type === type);
}

export function getSettingsByCategory(category: string): PlatformSettings[] {
  return mockPlatformSettings.filter(setting => setting.category === category);
}

export function updateUserStatus(userId: string, status: User['status']): boolean {
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    user.status = status;
    return true;
  }
  return false;
}

export function updateModerationStatus(
  itemId: string, 
  status: ContentModerationItem['status'], 
  moderatorName: string
): boolean {
  const item = mockModerationQueue.find(i => i.id === itemId);
  if (item) {
    item.status = status;
    item.moderatedAt = new Date().toISOString();
    item.moderatedBy = moderatorName;
    return true;
  }
  return false;
}