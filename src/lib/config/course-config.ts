/**
 * Configurações globais dos cursos
 * Este arquivo centraliza todas as configurações editáveis dos cursos
 */

export interface CourseConfig {
  id: string;
  title: string;
  subtitle: string;
  instructor: string;
  instructorTitle: string;
  rating: number;
  students: number;
  duration: string;
  lessons: number;
  level: 'Básico' | 'Intermediário' | 'Avançado';
  price: number;
  originalPrice: number;
  discount: number;
  category: 'Premium' | 'Popular' | 'Novo' | 'Trending' | 'Básico';
  thumbnail: string;
  description: string;
  highlights: string[];
  modules: string[];
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  // Novos campos para controle avançado
  enrollmentLimit?: number;
  startDate?: string;
  endDate?: string;
  prerequisites?: string[];
  tags?: string[];
  difficulty: number; // 1-5
  estimatedHours: number;
  certificateTemplate?: string;
  instructorBio?: string;
  instructorImage?: string;
  courseTrailer?: string;
  materials?: {
    type: 'pdf' | 'video' | 'audio' | 'image' | 'link';
    title: string;
    url: string;
    description?: string;
  }[];
}

export interface CategoryTheme {
  gradient: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconColor: string;
  hoverColor: string;
}

export interface GlobalSettings {
  // Site Info
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl: string;
  faviconUrl: string;

  // Colors & Theme
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;

  // Currency & Pricing
  defaultCurrency: 'BRL' | 'USD' | 'EUR';
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  decimalPlaces: number;

  // Display Settings
  maxStudentsDisplay: number;
  coursesPerPage: number;
  showInstructorInfo: boolean;
  showRatings: boolean;
  showStudentCount: boolean;
  showDuration: boolean;
  showLessonCount: boolean;

  // Features
  enableDiscounts: boolean;
  enableRatings: boolean;
  enableProgress: boolean;
  enableCertificates: boolean;
  enableWishlist: boolean;
  enableReviews: boolean;
  enableSocialShare: boolean;
  enableCoursePreview: boolean;

  // Email & Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;

  // SEO & Analytics
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];

  // Social Media
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };

  // Advanced Settings
  maintenanceMode: boolean;
  debugMode: boolean;
  cacheEnabled: boolean;
  compressionEnabled: boolean;

  // Content Settings
  defaultLanguage: string;
  supportedLanguages: string[];
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

// Configurações padrão
export const defaultGlobalSettings: GlobalSettings = {
  // Site Info
  siteName: 'Facelift Academy',
  siteDescription:
    'Descubra os melhores cursos de cirurgia plástica facial com especialistas renomados',
  siteUrl: 'https://faceliftacademy.com',
  logoUrl: '/images/logos/legacy-mentoring-auth.webp',
  faviconUrl: '/favicon.ico',

  // Colors & Theme
  primaryColor: '#8b5cf6',
  secondaryColor: '#ec4899',
  accentColor: '#10b981',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',

  // Currency & Pricing
  defaultCurrency: 'BRL',
  currencySymbol: 'R$',
  currencyPosition: 'before',
  decimalPlaces: 0,

  // Display Settings
  maxStudentsDisplay: 10000,
  coursesPerPage: 12,
  showInstructorInfo: true,
  showRatings: true,
  showStudentCount: true,
  showDuration: true,
  showLessonCount: true,

  // Features
  enableDiscounts: true,
  enableRatings: true,
  enableProgress: true,
  enableCertificates: true,
  enableWishlist: true,
  enableReviews: true,
  enableSocialShare: true,
  enableCoursePreview: true,

  // Email & Notifications
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: true,

  // SEO & Analytics
  metaTitle: 'Facelift Academy - Cursos de Cirurgia Plástica Facial',
  metaDescription:
    'Aprenda técnicas avançadas de cirurgia plástica facial com os melhores especialistas. Cursos online com certificação internacional.',
  metaKeywords: [
    'cirurgia plástica',
    'facelift',
    'rinoplastia',
    'blefaroplastia',
    'curso online',
    'medicina estética',
  ],

  // Social Media
  socialLinks: {
    instagram: 'https://instagram.com/faceliftacademy',
    facebook: 'https://facebook.com/faceliftacademy',
    youtube: 'https://youtube.com/faceliftacademy',
  },

  // Advanced Settings
  maintenanceMode: false,
  debugMode: false,
  cacheEnabled: true,
  compressionEnabled: true,

  // Content Settings
  defaultLanguage: 'pt-BR',
  supportedLanguages: ['pt-BR', 'en-US', 'es-ES'],
  timezone: 'America/Sao_Paulo',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
};

// Temas das categorias
export const categoryThemes: Record<string, CategoryTheme> = {
  Premium: {
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-500',
    iconColor: 'text-purple-500',
    hoverColor: 'hover:bg-purple-50 dark:hover:bg-purple-900/50',
  },
  Popular: {
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-500',
    hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/50',
  },
  Novo: {
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-600',
    borderColor: 'border-green-500',
    iconColor: 'text-green-500',
    hoverColor: 'hover:bg-green-50 dark:hover:bg-green-900/50',
  },
  Trending: {
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-500',
    iconColor: 'text-orange-500',
    hoverColor: 'hover:bg-orange-50 dark:hover:bg-orange-900/50',
  },
  Básico: {
    gradient: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-900',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-500',
    iconColor: 'text-gray-500',
    hoverColor: 'hover:bg-gray-50 dark:hover:bg-gray-900/50',
  },
};

// Funções utilitárias
export const formatPrice = (
  price: number,
  settings: GlobalSettings
): string => {
  const formatted = price.toLocaleString('pt-BR', {
    minimumFractionDigits: settings.decimalPlaces,
    maximumFractionDigits: settings.decimalPlaces,
  });

  return settings.currencyPosition === 'before'
    ? `${settings.currencySymbol} ${formatted}`
    : `${formatted} ${settings.currencySymbol}`;
};

export const getCategoryTheme = (category: string): CategoryTheme => {
  return categoryThemes[category] || categoryThemes.Básico;
};

export const validateCourseConfig = (
  course: Partial<CourseConfig>
): string[] => {
  const errors: string[] = [];

  if (!course.title?.trim()) errors.push('Título é obrigatório');
  if (!course.instructor?.trim()) errors.push('Instrutor é obrigatório');
  if (!course.description?.trim()) errors.push('Descrição é obrigatória');
  if (!course.price || course.price < 0)
    errors.push('Preço deve ser maior que zero');
  if (!course.lessons || course.lessons < 1)
    errors.push('Deve ter pelo menos 1 aula');
  if (!course.duration?.trim()) errors.push('Duração é obrigatória');
  if (!course.category) errors.push('Categoria é obrigatória');
  if (!course.level) errors.push('Nível é obrigatório');

  return errors;
};

// Hook para usar as configurações (seria implementado com Context API)
export const useCourseConfig = () => {
  // Aqui seria implementada a lógica para buscar/salvar configurações
  // Por enquanto retorna valores padrão
  return {
    globalSettings: defaultGlobalSettings,
    categoryThemes,
    updateGlobalSettings: (settings: Partial<GlobalSettings>) => {
      },
    updateCategoryTheme: (category: string, theme: Partial<CategoryTheme>) => {
      },
  };
};
