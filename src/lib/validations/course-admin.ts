/**
 * Zod validation schemas for Course Administration System
 * Provides runtime validation for all configuration types
 */

import { z } from 'zod';

// Base validation schemas
const ImageAssetSchema = z.object({
  id: z.string().optional(),
  file: z.instanceof(File).nullable(),
  url: z.string().url().optional(),
  filename: z.string().optional(),
  originalName: z.string().optional(),
  mimeType: z.string().optional(),
  size: z.number().positive().optional(),
  uploadedAt: z.string().optional(),
  uploadedBy: z.string().optional(),
});

const NavigationLinkSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  label: z
    .string()
    .min(1, 'Label is required')
    .max(50, 'Label must be less than 50 characters'),
  url: z.string().url('Must be a valid URL'),
  order: z.number().int().min(0, 'Order must be a positive integer'),
  visible: z.boolean(),
});

const AuthColorsSchema = z.object({
  primary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  secondary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  background: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  text: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  accent: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
});

const LogoSettingsSchema = z.object({
  horizontal: ImageAssetSchema,
  favicon: ImageAssetSchema,
});

const ButtonStylesSchema = z.object({
  primary: z.object({
    backgroundColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    borderColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    hoverBackgroundColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  }),
  secondary: z.object({
    backgroundColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    borderColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    hoverBackgroundColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  }),
});

// Email Configuration Schemas
const EmailTemplateSchema = z.object({
  enabled: z.boolean(),
  autoAccess: z.boolean(),
  customContent: z
    .string()
    .max(5000, 'Content must be less than 5000 characters'),
  subject: z
    .string()
    .max(200, 'Subject must be less than 200 characters')
    .optional(),
});

export const EmailConfigurationSchema = z.object({
  theme: z.object({
    backgroundColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    bodyColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    footerTextColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    linkColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  }),
  branding: z.object({
    logo: z.object({
      file: z.instanceof(File).nullable(),
      height: z
        .number()
        .int()
        .min(20, 'Height must be at least 20px')
        .max(200, 'Height must be at most 200px'),
      maxSize: z
        .number()
        .int()
        .max(204800, 'File size must be less than 200KB'), // 200KB in bytes
      url: z.string().url().optional(),
    }),
  }),
  sender: z.object({
    name: z
      .string()
      .min(1, 'Sender name is required')
      .max(100, 'Name must be less than 100 characters'),
    replyTo: z.string().email('Must be a valid email address'),
  }),
  templates: z.object({
    welcomeSales: EmailTemplateSchema,
    welcomeMigration: EmailTemplateSchema,
    welcomeFree: EmailTemplateSchema,
    newAccess: EmailTemplateSchema,
  }),
  settings: z.object({
    enableEmailSending: z.boolean(),
    enableAutoAccess: z.boolean(),
  }),
});

// Appearance Configuration Schemas
const FooterSettingsSchema = z.object({
  visible: z.boolean(),
  showMessage: z.boolean(),
  message: z.string().max(500, 'Message must be less than 500 characters'),
  showDisclaimer: z.boolean(),
  disclaimer: z
    .string()
    .max(1000, 'Disclaimer must be less than 1000 characters'),
  showTerms: z.boolean(),
  termsUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  showPrivacy: z.boolean(),
  privacyUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export const AppearanceConfigurationSchema = z.object({
  studentArea: z.object({
    pageTitle: z
      .string()
      .min(1, 'Page title is required')
      .max(100, 'Title must be less than 100 characters'),
    highlightColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    darkMode: z.boolean(),
    theme: z.enum(['educational', 'academic']),
    footer: FooterSettingsSchema,
    navigation: z
      .array(NavigationLinkSchema)
      .max(10, 'Maximum 10 navigation links allowed'),
  }),
  authentication: z.object({
    formPosition: z.enum(['left', 'right']),
    colors: AuthColorsSchema,
    backgroundImage: ImageAssetSchema,
    logo: LogoSettingsSchema,
    buttons: ButtonStylesSchema,
  }),
  adminArea: z.object({
    logo: ImageAssetSchema,
    highlightColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    greeting: z.enum(['firstName', 'fullName']),
  }),
  pwa: z.object({
    title: z
      .string()
      .min(1, 'PWA title is required')
      .max(50, 'Title must be less than 50 characters'),
    icon: ImageAssetSchema,
  }),
});

// Domain and General Configuration Schemas
export const GeneralConfigurationSchema = z.object({
  domain: z.object({
    custom: z
      .string()
      .regex(
        /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
        'Must be a valid domain name'
      )
      .optional()
      .or(z.literal('')),
    cname: z.string().optional(),
    token: z.string().optional(),
    active: z.boolean(),
    verified: z.boolean(),
  }),
  dynamicPages: z.object({
    homeFlowUrl: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),
    firstAccessUrl: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),
  }),
  localization: z.object({
    language: z.enum(['pt', 'es', 'en']),
  }),
  legal: z.object({
    termsRequired: z.boolean(),
    termsContent: z
      .string()
      .max(10000, 'Terms content must be less than 10000 characters'),
    termsUrl: z.string().url('Must be a valid URL').optional(),
  }),
  socialSharing: z.object({
    title: z
      .string()
      .min(1, 'Social sharing title is required')
      .max(100, 'Title must be less than 100 characters'),
    description: z
      .string()
      .max(300, 'Description must be less than 300 characters'),
    image: ImageAssetSchema,
  }),
});

// User Management Configuration Schemas
export const UserConfigurationSchema = z.object({
  authentication: z.object({
    passwordField: z.enum(['default', 'email', 'cpf']),
    defaultPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be less than 50 characters'),
    randomPasswords: z.boolean(),
  }),
  profileRestrictions: z.object({
    blockNameCpf: z.boolean(),
    blockEmail: z.boolean(),
    hideDocument: z.boolean(),
    hideAddress: z.boolean(),
    hidePhone: z.boolean(),
  }),
  registration: z.object({
    freeRegistration: z.object({
      viaLogin: z.boolean(),
      viaUrl: z.boolean(),
      restrictDomains: z.boolean(),
      allowedDomains: z
        .array(
          z
            .string()
            .regex(
              /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
              'Must be a valid domain'
            )
        )
        .max(50, 'Maximum 50 domains allowed'),
      recaptcha: z.boolean(),
    }),
    productAccess: z.array(z.string()).max(100, 'Maximum 100 products allowed'),
    freeUsersOnly: z.boolean(),
  }),
});

// Support Features Configuration Schemas
export const SupportConfigurationSchema = z.object({
  comments: z.object({
    enabled: z.boolean(),
    moderation: z.boolean(),
    title: z.string().max(100, 'Title must be less than 100 characters'),
    showTags: z.boolean(),
    placeholder: z
      .string()
      .max(200, 'Placeholder must be less than 200 characters'),
  }),
  questions: z.object({
    enabled: z.boolean(),
    title: z.string().max(100, 'Title must be less than 100 characters'),
    placeholder: z
      .string()
      .max(200, 'Placeholder must be less than 200 characters'),
  }),
  support: z.object({
    enabled: z.boolean(),
  }),
  faq: z.object({
    enabled: z.boolean(),
  }),
  userDisplay: z.object({
    format: z.enum(['firstName', 'fullName']),
  }),
});

// Advanced Features Configuration Schemas
const ApiKeySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  key: z.string().min(32, 'API key must be at least 32 characters'),
  permissions: z
    .array(z.string())
    .min(1, 'At least one permission is required'),
  createdAt: z.string().datetime('Must be a valid ISO datetime'),
  lastUsed: z.string().datetime('Must be a valid ISO datetime').optional(),
  active: z.boolean(),
});

export const AdvancedConfigurationSchema = z.object({
  certificates: z.object({
    enabled: z.boolean(),
  }),
  progressTracking: z.object({
    autoMarkLessons: z.boolean(),
  }),
  dynamicContent: z.object({
    enabled: z.boolean(),
  }),
  drm: z.object({
    socialPdf: z.boolean(),
    pandaVideo: z.boolean(),
    videofront: z.boolean(),
    position: z.enum(['top', 'left', 'footer']),
  }),
  apiKeys: z.array(ApiKeySchema).max(20, 'Maximum 20 API keys allowed'),
});

// Gamification Configuration Schemas
const GamificationTriggerSchema = z.object({
  enabled: z.boolean(),
  points: z
    .number()
    .int()
    .min(0, 'Points must be a positive integer')
    .max(10000, 'Points must be less than 10000'),
});

export const GamificationConfigurationSchema = z.object({
  display: z.object({
    showRanking: z.boolean(),
    showTotalUsers: z.boolean(),
    showFullNames: z.boolean(),
  }),
  triggers: z.object({
    lessonCompleted: GamificationTriggerSchema,
    courseStarted: GamificationTriggerSchema,
    progress50: GamificationTriggerSchema,
    progress75: GamificationTriggerSchema,
    progress90: GamificationTriggerSchema,
    courseCompleted: GamificationTriggerSchema,
    certificateIssued: GamificationTriggerSchema,
    questionSubmitted: GamificationTriggerSchema,
    commentPosted: GamificationTriggerSchema,
    examPassed: GamificationTriggerSchema,
  }),
});

// Main Configuration Schema
export const CourseAdminConfigurationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  organizationId: z.string().min(1, 'Organization ID is required'),
  email: EmailConfigurationSchema,
  appearance: AppearanceConfigurationSchema,
  general: GeneralConfigurationSchema,
  users: UserConfigurationSchema,
  support: SupportConfigurationSchema,
  advanced: AdvancedConfigurationSchema,
  gamification: GamificationConfigurationSchema,
  version: z.number().int().min(1, 'Version must be at least 1'),
  lastModified: z.string().datetime('Must be a valid ISO datetime'),
  modifiedBy: z.string().min(1, 'Modified by is required'),
});

// Asset Management Schemas
export const AssetUploadSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  filename: z.string().min(1, 'Filename is required'),
  originalName: z.string().min(1, 'Original name is required'),
  mimeType: z
    .string()
    .regex(
      /^(image\/(jpeg|jpg|png|gif|webp)|application\/pdf)$/,
      'Must be a valid MIME type'
    ),
  size: z.number().int().positive('Size must be positive'),
  url: z.string().url('Must be a valid URL'),
  uploadedAt: z.string().datetime('Must be a valid ISO datetime'),
  uploadedBy: z.string().min(1, 'Uploaded by is required'),
  category: z.enum(['logo', 'background', 'icon', 'sharing']),
});

// Configuration History Schemas
const ConfigurationChangeSchema = z.object({
  field: z.string().min(1, 'Field is required'),
  oldValue: z.any(),
  newValue: z.any(),
  section: z.string().min(1, 'Section is required'),
});

export const ConfigurationHistorySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  configurationId: z.string().min(1, 'Configuration ID is required'),
  changes: z
    .array(ConfigurationChangeSchema)
    .min(1, 'At least one change is required'),
  timestamp: z.string().datetime('Must be a valid ISO datetime'),
  userId: z.string().min(1, 'User ID is required'),
  userName: z.string().min(1, 'User name is required'),
  reason: z
    .string()
    .max(500, 'Reason must be less than 500 characters')
    .optional(),
});

// Error Handling Schemas
export const ConfigurationErrorSchema = z.object({
  type: z.enum(['validation', 'upload', 'network', 'permission']),
  field: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  code: z.string().min(1, 'Code is required'),
  recoverable: z.boolean(),
  suggestions: z.array(z.string()).optional(),
});

// Validation helper functions
export function validateEmailConfiguration(data: unknown) {
  return EmailConfigurationSchema.safeParse(data);
}

export function validateAppearanceConfiguration(data: unknown) {
  return AppearanceConfigurationSchema.safeParse(data);
}

export function validateGeneralConfiguration(data: unknown) {
  return GeneralConfigurationSchema.safeParse(data);
}

export function validateUserConfiguration(data: unknown) {
  return UserConfigurationSchema.safeParse(data);
}

export function validateSupportConfiguration(data: unknown) {
  return SupportConfigurationSchema.safeParse(data);
}

export function validateAdvancedConfiguration(data: unknown) {
  return AdvancedConfigurationSchema.safeParse(data);
}

export function validateGamificationConfiguration(data: unknown) {
  return GamificationConfigurationSchema.safeParse(data);
}

export function validateCourseAdminConfiguration(data: unknown) {
  return CourseAdminConfigurationSchema.safeParse(data);
}

// File validation helpers
export function validateImageFile(
  file: File,
  maxSize: number = 1024 * 1024
): { valid: boolean; error?: string } {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File must be an image (JPEG, PNG, GIF, or WebP)',
    };
  }

  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

export function validateDomain(domain: string): {
  valid: boolean;
  error?: string;
} {
  const domainRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

  if (!domainRegex.test(domain)) {
    return { valid: false, error: 'Must be a valid domain name' };
  }

  return { valid: true };
}

export function validateHexColor(color: string): {
  valid: boolean;
  error?: string;
} {
  const hexRegex = /^#[0-9A-F]{6}$/i;

  if (!hexRegex.test(color)) {
    return { valid: false, error: 'Must be a valid hex color (e.g., #FF0000)' };
  }

  return { valid: true };
}
