/**
 * Core TypeScript interfaces for Course Administration System
 * Based on the design document specifications
 */

// Base interfaces for common types
export interface ImageAsset {
  id?: string;
  file: File | null;
  url?: string;
  filename?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  uploadedAt?: string;
  uploadedBy?: string;
}

export interface NavigationLink {
  id: string;
  label: string;
  url: string;
  order: number;
  visible: boolean;
}

export interface AuthColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export interface LogoSettings {
  horizontal: ImageAsset;
  favicon: ImageAsset;
}

export interface ButtonStyles {
  primary: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    hoverBackgroundColor: string;
  };
  secondary: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    hoverBackgroundColor: string;
  };
}

// Email Configuration Interfaces
export interface EmailTemplate {
  enabled: boolean;
  autoAccess: boolean;
  customContent: string;
  subject?: string;
}

export interface EmailConfiguration {
  theme: {
    backgroundColor: string;
    bodyColor: string;
    textColor: string;
    footerTextColor: string;
    linkColor: string;
  };
  branding: {
    logo: {
      file: File | null;
      height: number;
      maxSize: number; // 200kb
      url?: string;
    };
  };
  sender: {
    name: string;
    replyTo: string;
  };
  templates: {
    welcomeSales: EmailTemplate;
    welcomeMigration: EmailTemplate;
    welcomeFree: EmailTemplate;
    newAccess: EmailTemplate;
  };
  settings: {
    enableEmailSending: boolean;
    enableAutoAccess: boolean;
  };
}

// Appearance Configuration Interfaces
export interface FooterSettings {
  visible: boolean;
  showMessage: boolean;
  message: string;
  showDisclaimer: boolean;
  disclaimer: string;
  showTerms: boolean;
  termsUrl: string;
  showPrivacy: boolean;
  privacyUrl: string;
}

export interface AppearanceConfiguration {
  studentArea: {
    pageTitle: string;
    highlightColor: string;
    darkMode: boolean;
    theme: 'educational' | 'academic';
    footer: FooterSettings;
    navigation: NavigationLink[];
  };
  authentication: {
    formPosition: 'left' | 'right';
    colors: AuthColors;
    backgroundImage: ImageAsset;
    logo: LogoSettings;
    buttons: ButtonStyles;
  };
  adminArea: {
    logo: ImageAsset;
    highlightColor: string;
    greeting: 'firstName' | 'fullName';
  };
  pwa: {
    title: string;
    icon: ImageAsset;
  };
}

// Domain and General Configuration Interfaces
export interface GeneralConfiguration {
  domain: {
    custom: string;
    cname: string;
    token: string;
    active: boolean;
    verified: boolean;
  };
  dynamicPages: {
    homeFlowUrl: string;
    firstAccessUrl: string;
  };
  localization: {
    language: 'pt' | 'es' | 'en';
  };
  legal: {
    termsRequired: boolean;
    termsContent: string;
    termsUrl?: string;
  };
  socialSharing: {
    title: string;
    description: string;
    image: ImageAsset;
  };
}

// User Management Configuration Interfaces
export interface UserConfiguration {
  authentication: {
    passwordField: 'default' | 'email' | 'cpf';
    defaultPassword: string;
    randomPasswords: boolean;
  };
  profileRestrictions: {
    blockNameCpf: boolean;
    blockEmail: boolean;
    hideDocument: boolean;
    hideAddress: boolean;
    hidePhone: boolean;
  };
  registration: {
    freeRegistration: {
      viaLogin: boolean;
      viaUrl: boolean;
      restrictDomains: boolean;
      allowedDomains: string[];
      recaptcha: boolean;
    };
    productAccess: string[];
    freeUsersOnly: boolean;
  };
}

// Support Features Configuration Interfaces
export interface SupportConfiguration {
  comments: {
    enabled: boolean;
    moderation: boolean;
    title: string;
    showTags: boolean;
    placeholder: string;
  };
  questions: {
    enabled: boolean;
    title: string;
    placeholder: string;
  };
  support: {
    enabled: boolean;
  };
  faq: {
    enabled: boolean;
  };
  userDisplay: {
    format: 'firstName' | 'fullName';
  };
}

// Advanced Features Configuration Interfaces
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  active: boolean;
}

export interface AdvancedConfiguration {
  certificates: {
    enabled: boolean;
  };
  progressTracking: {
    autoMarkLessons: boolean;
  };
  dynamicContent: {
    enabled: boolean;
  };
  drm: {
    socialPdf: boolean;
    pandaVideo: boolean;
    videofront: boolean;
    position: 'top' | 'left' | 'footer';
  };
  apiKeys: ApiKey[];
}

// Gamification Configuration Interfaces
export interface GamificationTrigger {
  enabled: boolean;
  points: number;
}

export interface GamificationConfiguration {
  display: {
    showRanking: boolean;
    showTotalUsers: boolean;
    showFullNames: boolean;
  };
  triggers: {
    lessonCompleted: GamificationTrigger;
    courseStarted: GamificationTrigger;
    progress50: GamificationTrigger;
    progress75: GamificationTrigger;
    progress90: GamificationTrigger;
    courseCompleted: GamificationTrigger;
    certificateIssued: GamificationTrigger;
    questionSubmitted: GamificationTrigger;
    commentPosted: GamificationTrigger;
    examPassed: GamificationTrigger;
  };
}

// Main Configuration Interface
export interface CourseAdminConfiguration {
  id: string;
  organizationId: string;
  email: EmailConfiguration;
  appearance: AppearanceConfiguration;
  general: GeneralConfiguration;
  users: UserConfiguration;
  support: SupportConfiguration;
  advanced: AdvancedConfiguration;
  gamification: GamificationConfiguration;
  version: number;
  lastModified: string;
  modifiedBy: string;
}

export interface ConfigurationChange {
  field: string;
  oldValue: import('./index').JsonValue;
  newValue: import('./index').JsonValue;
  section: string;
}

export interface ConfigurationHistory {
  id: string;
  configurationId: string;
  changes: ConfigurationChange[];
  timestamp: string;
  userId: string;
  userName: string;
  reason?: string;
}

// Asset Management Interfaces
export interface AssetUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  category: 'logo' | 'background' | 'icon' | 'sharing';
}

// Error Handling Interfaces
export interface ConfigurationError {
  type: 'validation' | 'upload' | 'network' | 'permission';
  field?: string;
  message: string;
  code: string;
  recoverable: boolean;
  suggestions?: string[];
}
