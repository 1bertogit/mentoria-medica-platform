/**
 * Mock data structures for Course Administration System
 * Extends existing admin mock data with course configuration data
 */

import type {
  CourseAdminConfiguration,
  EmailConfiguration,
  AppearanceConfiguration,
  GeneralConfiguration,
  UserConfiguration,
  SupportConfiguration,
  AdvancedConfiguration,
  GamificationConfiguration,
  AssetUpload,
  ConfigurationHistory,
  ApiKey,
} from '../../types/course-admin';

// Mock API Keys
export const mockApiKeys: ApiKey[] = [
  {
    id: 'api-1',
    name: 'Main Integration API',
    key: 'sk_live_mock_key_1234567890abcdef',
    permissions: ['read:courses', 'write:users', 'read:analytics'],
    createdAt: '2024-01-15T10:00:00Z',
    lastUsed: '2024-01-20T14:30:00Z',
    active: true,
  },
  {
    id: 'api-2',
    name: 'Analytics Dashboard',
    key: 'sk_test_mock_key_98765432109876543210',
    permissions: ['read:analytics', 'read:reports'],
    createdAt: '2024-01-10T16:45:00Z',
    lastUsed: '2024-01-19T09:15:00Z',
    active: true,
  },
  {
    id: 'api-3',
    name: 'Legacy Integration',
    key: 'sk_live_mock_key_abcdef1234567890',
    permissions: ['read:courses'],
    createdAt: '2023-12-01T12:00:00Z',
    active: false,
  },
];

// Mock Asset Uploads
export const mockAssetUploads: AssetUpload[] = [
  {
    id: 'asset-1',
    filename: 'logo-horizontal.png',
    originalName: 'company-logo-horizontal.png',
    mimeType: 'image/png',
    size: 45678,
    url: '/uploads/logos/logo-horizontal.png',
    uploadedAt: '2024-01-15T10:00:00Z',
    uploadedBy: 'Dr. Ana Silva',
    category: 'logo',
  },
  {
    id: 'asset-2',
    filename: 'favicon.png',
    originalName: 'favicon-32x32.png',
    mimeType: 'image/png',
    size: 2048,
    url: '/uploads/icons/favicon.png',
    uploadedAt: '2024-01-15T10:05:00Z',
    uploadedBy: 'Dr. Ana Silva',
    category: 'icon',
  },
  {
    id: 'asset-3',
    filename: 'auth-background.jpg',
    originalName: 'medical-background.jpg',
    mimeType: 'image/jpeg',
    size: 789012,
    url: '/uploads/backgrounds/auth-background.jpg',
    uploadedAt: '2024-01-16T14:20:00Z',
    uploadedBy: 'Dr. Ana Silva',
    category: 'background',
  },
  {
    id: 'asset-4',
    filename: 'social-sharing.png',
    originalName: 'social-media-preview.png',
    mimeType: 'image/png',
    size: 156789,
    url: '/uploads/sharing/social-sharing.png',
    uploadedAt: '2024-01-17T09:30:00Z',
    uploadedBy: 'Dr. Ana Silva',
    category: 'sharing',
  },
];

// Mock Email Configuration
export const mockEmailConfiguration: EmailConfiguration = {
  theme: {
    backgroundColor: '#FFFFFF',
    bodyColor: '#F8F9FA',
    textColor: '#212529',
    footerTextColor: '#6C757D',
    linkColor: '#0D6EFD',
  },
  branding: {
    logo: {
      file: null,
      height: 60,
      maxSize: 204800, // 200KB
      url: '/uploads/logos/email-logo.png',
    },
  },
  sender: {
    name: 'Mentoria Médica',
    replyTo: 'noreply@mentoriamedica.com',
  },
  templates: {
    welcomeSales: {
      enabled: true,
      autoAccess: true,
      customContent:
        'Bem-vindo à nossa plataforma! Seu acesso foi liberado automaticamente.',
      subject: 'Bem-vindo à Mentoria Médica - Acesso Liberado',
    },
    welcomeMigration: {
      enabled: true,
      autoAccess: false,
      customContent:
        'Sua conta foi migrada com sucesso. Entre em contato para liberar o acesso.',
      subject: 'Migração de Conta Concluída',
    },
    welcomeFree: {
      enabled: true,
      autoAccess: true,
      customContent:
        'Obrigado por se cadastrar! Explore nosso conteúdo gratuito.',
      subject: 'Cadastro Realizado - Conteúdo Gratuito Disponível',
    },
    newAccess: {
      enabled: true,
      autoAccess: true,
      customContent: 'Novo acesso liberado em sua conta. Aproveite o conteúdo!',
      subject: 'Novo Acesso Liberado',
    },
  },
  settings: {
    enableEmailSending: true,
    enableAutoAccess: true,
  },
};

// Mock Appearance Configuration
export const mockAppearanceConfiguration: AppearanceConfiguration = {
  studentArea: {
    pageTitle: 'Mentoria Médica - Plataforma de Ensino',
    highlightColor: '#0D6EFD',
    darkMode: false,
    theme: 'educational',
    footer: {
      visible: true,
      showMessage: true,
      message: 'Plataforma desenvolvida para profissionais da saúde',
      showDisclaimer: true,
      disclaimer: 'Todo conteúdo é apenas para fins educacionais',
      showTerms: true,
      termsUrl: 'https://mentoriamedica.com/termos',
      showPrivacy: true,
      privacyUrl: 'https://mentoriamedica.com/privacidade',
    },
    navigation: [
      {
        id: 'nav-1',
        label: 'Cursos',
        url: '/academy',
        order: 1,
        visible: true,
      },
      {
        id: 'nav-2',
        label: 'Biblioteca',
        url: '/library',
        order: 2,
        visible: true,
      },
      {
        id: 'nav-3',
        label: 'Casos Clínicos',
        url: '/cases',
        order: 3,
        visible: true,
      },
    ],
  },
  authentication: {
    formPosition: 'right',
    colors: {
      primary: '#0D6EFD',
      secondary: '#6C757D',
      background: '#FFFFFF',
      text: '#212529',
      accent: '#198754',
    },
    backgroundImage: {
      id: 'asset-3',
      file: null,
      url: '/uploads/backgrounds/auth-background.jpg',
      filename: 'auth-background.jpg',
      mimeType: 'image/jpeg',
      size: 789012,
    },
    logo: {
      horizontal: {
        id: 'asset-1',
        file: null,
        url: '/uploads/logos/logo-horizontal.png',
        filename: 'logo-horizontal.png',
        mimeType: 'image/png',
        size: 45678,
      },
      favicon: {
        id: 'asset-2',
        file: null,
        url: '/uploads/icons/favicon.png',
        filename: 'favicon.png',
        mimeType: 'image/png',
        size: 2048,
      },
    },
    buttons: {
      primary: {
        backgroundColor: '#0D6EFD',
        textColor: '#FFFFFF',
        borderColor: '#0D6EFD',
        hoverBackgroundColor: '#0B5ED7',
      },
      secondary: {
        backgroundColor: '#6C757D',
        textColor: '#FFFFFF',
        borderColor: '#6C757D',
        hoverBackgroundColor: '#5C636A',
      },
    },
  },
  adminArea: {
    logo: {
      id: 'asset-1',
      file: null,
      url: '/uploads/logos/admin-logo.png',
      filename: 'admin-logo.png',
      mimeType: 'image/png',
      size: 32456,
    },
    highlightColor: '#DC3545',
    greeting: 'firstName',
  },
  pwa: {
    title: 'Mentoria Médica',
    icon: {
      id: 'pwa-icon-1',
      file: null,
      url: '/uploads/icons/pwa-icon-1024.png',
      filename: 'pwa-icon-1024.png',
      mimeType: 'image/png',
      size: 245678,
    },
  },
};

// Mock General Configuration
export const mockGeneralConfiguration: GeneralConfiguration = {
  domain: {
    custom: 'app.mentoriamedica.com',
    cname: 'app.mentoriamedica.com.cdn.cloudflare.net',
    token: 'cf_token_1234567890abcdef',
    active: true,
    verified: true,
  },
  dynamicPages: {
    homeFlowUrl: 'https://mentoriamedica.com/inicio',
    firstAccessUrl: 'https://mentoriamedica.com/primeiro-acesso',
  },
  localization: {
    language: 'pt',
  },
  legal: {
    termsRequired: true,
    termsContent: 'Termos de uso da plataforma...',
    termsUrl: 'https://mentoriamedica.com/termos',
  },
  socialSharing: {
    title: 'Mentoria Médica - Educação Continuada',
    description:
      'Plataforma de ensino para profissionais da saúde com cursos, casos clínicos e biblioteca especializada.',
    image: {
      id: 'asset-4',
      file: null,
      url: '/uploads/sharing/social-sharing.png',
      filename: 'social-sharing.png',
      mimeType: 'image/png',
      size: 156789,
    },
  },
};

// Mock User Configuration
export const mockUserConfiguration: UserConfiguration = {
  authentication: {
    passwordField: 'email',
    defaultPassword: 'mentoria123',
    randomPasswords: false,
  },
  profileRestrictions: {
    blockNameCpf: false,
    blockEmail: true,
    hideDocument: false,
    hideAddress: true,
    hidePhone: true,
  },
  registration: {
    freeRegistration: {
      viaLogin: true,
      viaUrl: true,
      restrictDomains: false,
      allowedDomains: ['gmail.com', 'outlook.com', 'yahoo.com'],
      recaptcha: true,
    },
    productAccess: [
      'curso-rinoplastia',
      'curso-mamoplastia',
      'biblioteca-geral',
    ],
    freeUsersOnly: false,
  },
};

// Mock Support Configuration
export const mockSupportConfiguration: SupportConfiguration = {
  comments: {
    enabled: true,
    moderation: true,
    title: 'Comentários e Discussões',
    showTags: true,
    placeholder: 'Compartilhe sua experiência ou tire suas dúvidas...',
  },
  questions: {
    enabled: true,
    title: 'Perguntas Frequentes',
    placeholder: 'Digite sua pergunta aqui...',
  },
  support: {
    enabled: true,
  },
  faq: {
    enabled: true,
  },
  userDisplay: {
    format: 'firstName',
  },
};

// Mock Advanced Configuration
export const mockAdvancedConfiguration: AdvancedConfiguration = {
  certificates: {
    enabled: true,
  },
  progressTracking: {
    autoMarkLessons: false,
  },
  dynamicContent: {
    enabled: true,
  },
  drm: {
    socialPdf: true,
    pandaVideo: true,
    videofront: false,
    position: 'footer',
  },
  apiKeys: mockApiKeys,
};

// Mock Gamification Configuration
export const mockGamificationConfiguration: GamificationConfiguration = {
  display: {
    showRanking: true,
    showTotalUsers: true,
    showFullNames: false,
  },
  triggers: {
    lessonCompleted: {
      enabled: true,
      points: 10,
    },
    courseStarted: {
      enabled: true,
      points: 5,
    },
    progress50: {
      enabled: true,
      points: 25,
    },
    progress75: {
      enabled: true,
      points: 35,
    },
    progress90: {
      enabled: true,
      points: 45,
    },
    courseCompleted: {
      enabled: true,
      points: 100,
    },
    certificateIssued: {
      enabled: true,
      points: 50,
    },
    questionSubmitted: {
      enabled: true,
      points: 2,
    },
    commentPosted: {
      enabled: true,
      points: 3,
    },
    examPassed: {
      enabled: true,
      points: 75,
    },
  },
};

// Mock Complete Course Admin Configuration
export const mockCourseAdminConfiguration: CourseAdminConfiguration = {
  id: 'config-1',
  organizationId: 'org-mentoria-medica',
  email: mockEmailConfiguration,
  appearance: mockAppearanceConfiguration,
  general: mockGeneralConfiguration,
  users: mockUserConfiguration,
  support: mockSupportConfiguration,
  advanced: mockAdvancedConfiguration,
  gamification: mockGamificationConfiguration,
  version: 1,
  lastModified: '2024-01-20T15:30:00Z',
  modifiedBy: 'Dr. Ana Silva',
};

// Mock Configuration History
export const mockConfigurationHistory: ConfigurationHistory[] = [
  {
    id: 'history-1',
    configurationId: 'config-1',
    changes: [
      {
        field: 'email.theme.backgroundColor',
        oldValue: '#F8F9FA',
        newValue: '#FFFFFF',
        section: 'email',
      },
      {
        field: 'email.sender.name',
        oldValue: 'Plataforma Médica',
        newValue: 'Mentoria Médica',
        section: 'email',
      },
    ],
    timestamp: '2024-01-20T15:30:00Z',
    userId: '1',
    userName: 'Dr. Ana Silva',
    reason: 'Atualização da identidade visual',
  },
  {
    id: 'history-2',
    configurationId: 'config-1',
    changes: [
      {
        field: 'appearance.studentArea.highlightColor',
        oldValue: '#198754',
        newValue: '#0D6EFD',
        section: 'appearance',
      },
    ],
    timestamp: '2024-01-19T10:15:00Z',
    userId: '1',
    userName: 'Dr. Ana Silva',
    reason: 'Ajuste de cores do tema',
  },
  {
    id: 'history-3',
    configurationId: 'config-1',
    changes: [
      {
        field: 'gamification.triggers.lessonCompleted.points',
        oldValue: 5,
        newValue: 10,
        section: 'gamification',
      },
      {
        field: 'gamification.triggers.courseCompleted.points',
        oldValue: 50,
        newValue: 100,
        section: 'gamification',
      },
    ],
    timestamp: '2024-01-18T14:45:00Z',
    userId: '2',
    userName: 'Dr. Carlos Mendes',
    reason: 'Rebalanceamento do sistema de pontuação',
  },
];

// Helper Functions
export function getCourseAdminConfiguration(
  organizationId?: string
): CourseAdminConfiguration {
  // In a real implementation, this would filter by organizationId
  return mockCourseAdminConfiguration;
}

export function getConfigurationSection<
  T extends keyof CourseAdminConfiguration,
>(section: T): CourseAdminConfiguration[T] {
  return mockCourseAdminConfiguration[section];
}

export function updateConfigurationSection<
  T extends keyof CourseAdminConfiguration,
>(
  section: T,
  data: Partial<CourseAdminConfiguration[T]>
): CourseAdminConfiguration {
  const currentSection = mockCourseAdminConfiguration[section];
  const updatedSection =
    typeof currentSection === 'object' && currentSection !== null
      ? { ...(currentSection as object), ...(data as object) }
      : data;

  return {
    ...mockCourseAdminConfiguration,
    [section]: updatedSection,
    version: mockCourseAdminConfiguration.version + 1,
    lastModified: new Date().toISOString(),
  };
}

export function getAssetsByCategory(
  category: AssetUpload['category']
): AssetUpload[] {
  return mockAssetUploads.filter(asset => asset.category === category);
}

export function getConfigurationHistory(
  configId: string
): ConfigurationHistory[] {
  return mockConfigurationHistory.filter(
    history => history.configurationId === configId
  );
}

export function getActiveApiKeys(): ApiKey[] {
  return mockApiKeys.filter(key => key.active);
}

export function createApiKey(name: string, permissions: string[]): ApiKey {
  const newKey: ApiKey = {
    id: `api-${Date.now()}`,
    name,
    key: `sk_live_${Math.random().toString(36).substring(2, 34)}`,
    permissions,
    createdAt: new Date().toISOString(),
    active: true,
  };

  mockApiKeys.push(newKey);
  return newKey;
}

export function revokeApiKey(keyId: string): boolean {
  const key = mockApiKeys.find(k => k.id === keyId);
  if (key) {
    key.active = false;
    return true;
  }
  return false;
}

export function uploadAsset(
  file: File,
  category: AssetUpload['category'],
  uploadedBy: string
): AssetUpload {
  const asset: AssetUpload = {
    id: `asset-${Date.now()}`,
    filename: `${Date.now()}-${file.name}`,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url: `/uploads/${category}/${Date.now()}-${file.name}`,
    uploadedAt: new Date().toISOString(),
    uploadedBy,
    category,
  };

  mockAssetUploads.push(asset);
  return asset;
}

// Default configuration factory
export function createDefaultConfiguration(
  organizationId: string
): CourseAdminConfiguration {
  return {
    id: `config-${Date.now()}`,
    organizationId,
    email: {
      theme: {
        backgroundColor: '#FFFFFF',
        bodyColor: '#F8F9FA',
        textColor: '#212529',
        footerTextColor: '#6C757D',
        linkColor: '#0D6EFD',
      },
      branding: {
        logo: {
          file: null,
          height: 60,
          maxSize: 204800,
        },
      },
      sender: {
        name: 'Plataforma de Ensino',
        replyTo: 'noreply@example.com',
      },
      templates: {
        welcomeSales: {
          enabled: false,
          autoAccess: false,
          customContent: '',
        },
        welcomeMigration: {
          enabled: false,
          autoAccess: false,
          customContent: '',
        },
        welcomeFree: {
          enabled: false,
          autoAccess: false,
          customContent: '',
        },
        newAccess: {
          enabled: false,
          autoAccess: false,
          customContent: '',
        },
      },
      settings: {
        enableEmailSending: false,
        enableAutoAccess: false,
      },
    },
    appearance: {
      studentArea: {
        pageTitle: 'Plataforma de Ensino',
        highlightColor: '#0D6EFD',
        darkMode: false,
        theme: 'educational',
        footer: {
          visible: true,
          showMessage: false,
          message: '',
          showDisclaimer: false,
          disclaimer: '',
          showTerms: false,
          termsUrl: '',
          showPrivacy: false,
          privacyUrl: '',
        },
        navigation: [],
      },
      authentication: {
        formPosition: 'right',
        colors: {
          primary: '#0D6EFD',
          secondary: '#6C757D',
          background: '#FFFFFF',
          text: '#212529',
          accent: '#198754',
        },
        backgroundImage: {
          file: null,
        },
        logo: {
          horizontal: {
            file: null,
          },
          favicon: {
            file: null,
          },
        },
        buttons: {
          primary: {
            backgroundColor: '#0D6EFD',
            textColor: '#FFFFFF',
            borderColor: '#0D6EFD',
            hoverBackgroundColor: '#0B5ED7',
          },
          secondary: {
            backgroundColor: '#6C757D',
            textColor: '#FFFFFF',
            borderColor: '#6C757D',
            hoverBackgroundColor: '#5C636A',
          },
        },
      },
      adminArea: {
        logo: {
          file: null,
        },
        highlightColor: '#DC3545',
        greeting: 'firstName',
      },
      pwa: {
        title: 'Plataforma de Ensino',
        icon: {
          file: null,
        },
      },
    },
    general: {
      domain: {
        custom: '',
        cname: '',
        token: '',
        active: false,
        verified: false,
      },
      dynamicPages: {
        homeFlowUrl: '',
        firstAccessUrl: '',
      },
      localization: {
        language: 'pt',
      },
      legal: {
        termsRequired: false,
        termsContent: '',
      },
      socialSharing: {
        title: 'Plataforma de Ensino',
        description: '',
        image: {
          file: null,
        },
      },
    },
    users: {
      authentication: {
        passwordField: 'default',
        defaultPassword: '',
        randomPasswords: false,
      },
      profileRestrictions: {
        blockNameCpf: false,
        blockEmail: false,
        hideDocument: false,
        hideAddress: false,
        hidePhone: false,
      },
      registration: {
        freeRegistration: {
          viaLogin: false,
          viaUrl: false,
          restrictDomains: false,
          allowedDomains: [],
          recaptcha: false,
        },
        productAccess: [],
        freeUsersOnly: false,
      },
    },
    support: {
      comments: {
        enabled: false,
        moderation: false,
        title: 'Comentários',
        showTags: false,
        placeholder: 'Digite seu comentário...',
      },
      questions: {
        enabled: false,
        title: 'Perguntas',
        placeholder: 'Digite sua pergunta...',
      },
      support: {
        enabled: false,
      },
      faq: {
        enabled: false,
      },
      userDisplay: {
        format: 'firstName',
      },
    },
    advanced: {
      certificates: {
        enabled: false,
      },
      progressTracking: {
        autoMarkLessons: true,
      },
      dynamicContent: {
        enabled: false,
      },
      drm: {
        socialPdf: false,
        pandaVideo: false,
        videofront: false,
        position: 'footer',
      },
      apiKeys: [],
    },
    gamification: {
      display: {
        showRanking: false,
        showTotalUsers: false,
        showFullNames: false,
      },
      triggers: {
        lessonCompleted: {
          enabled: false,
          points: 0,
        },
        courseStarted: {
          enabled: false,
          points: 0,
        },
        progress50: {
          enabled: false,
          points: 0,
        },
        progress75: {
          enabled: false,
          points: 0,
        },
        progress90: {
          enabled: false,
          points: 0,
        },
        courseCompleted: {
          enabled: false,
          points: 0,
        },
        certificateIssued: {
          enabled: false,
          points: 0,
        },
        questionSubmitted: {
          enabled: false,
          points: 0,
        },
        commentPosted: {
          enabled: false,
          points: 0,
        },
        examPassed: {
          enabled: false,
          points: 0,
        },
      },
    },
    version: 1,
    lastModified: new Date().toISOString(),
    modifiedBy: 'System',
  };
}
