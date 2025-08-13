'use client';

import dynamic from 'next/dynamic';
import { 
  AdminDashboardLoading, 
  CourseConfigLoading, 
  ChartsLoading,
  UniversalLoading 
} from '@/components/ui/loading-states';

// === COMPONENTES ADMINISTRATIVOS COM LAZY LOADING ===

// Dashboard Admin Principal
export const AdminDashboard = dynamic(
  () => import('@/app/(app)/admin/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <AdminDashboardLoading />,
    ssr: false,
  }
);

// Configurações de Curso
export const CourseConfig = dynamic(
  () => import('@/app/(app)/admin/course-config/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <CourseConfigLoading />,
    ssr: false,
  }
);

// Configurações Avançadas
export const AdvancedConfig = dynamic(
  () => import('@/app/(app)/admin/course-config/advanced/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="form" />,
    ssr: false,
  }
);

// Configuração de Aparência
export const AppearanceConfig = dynamic(
  () => import('@/app/(app)/admin/course-config/appearance/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="form" />,
    ssr: false,
  }
);

// Configuração de Domínio
export const DomainConfig = dynamic(
  () => import('@/app/(app)/admin/course-config/domain/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="form" />,
    ssr: false,
  }
);

// Configuração de Email
export const EmailConfig = dynamic(
  () => import('@/app/(app)/admin/course-config/email/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="form" />,
    ssr: false,
  }
);

// Gamificação
export const GamificationConfig = dynamic(
  () => import('@/app/(app)/admin/course-config/gamification/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="form" />,
    ssr: false,
  }
);

// Suporte
export const SupportConfig = dynamic(
  () => import('@/app/(app)/admin/course-config/support/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="form" />,
    ssr: false,
  }
);

// Usuários do Curso
export const UsersConfig = dynamic(
  () => import('@/app/(app)/admin/course-config/users/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="table" />,
    ssr: false,
  }
);

// === PÁGINAS ADMINISTRATIVAS ===

// Métricas e Analytics
export const AdminMetrics = dynamic(
  () => import('@/app/(app)/admin/metrics/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <ChartsLoading />,
    ssr: false,
  }
);

// Analytics
export const AdminAnalytics = dynamic(
  () => import('@/app/(app)/admin/analytics/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <ChartsLoading />,
    ssr: false,
  }
);

// Health Check
export const AdminHealth = dynamic(
  () => import('@/app/(app)/admin/health/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="dashboard" />,
    ssr: false,
  }
);

// Upload de Conteúdo
export const AdminUpload = dynamic(
  () => import('@/app/(app)/admin/upload/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="form" />,
    ssr: false,
  }
);

// Produtos
export const AdminProducts = dynamic(
  () => import('@/app/(app)/admin/products/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="grid" />,
    ssr: false,
  }
);

// Gerenciamento de Usuários
export const AdminUsers = dynamic(
  () => import('@/app/(app)/admin/users/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="table" />,
    ssr: false,
  }
);

// Moderação
export const AdminModeration = dynamic(
  () => import('@/app/(app)/admin/moderation/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="table" />,
    ssr: false,
  }
);

// Configurações Gerais
export const AdminSettings = dynamic(
  () => import('@/app/(app)/admin/settings/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="form" />,
    ssr: false,
  }
);

// Criação de Novo Caso
export const NewCaseContent = dynamic(
  () => import('@/app/(app)/admin/content/new-case/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="form" />,
    ssr: false,
  }
);

// Cursos Admin
export const AdminCourses = dynamic(
  () => import('@/app/(app)/admin/courses/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <UniversalLoading type="grid" />,
    ssr: false,
  }
);

// === CONFIGURAÇÕES DE LAZY LOADING ===

// Configuração para componentes administrativos críticos (carregamento imediato em hover)
export const criticalAdminComponents = [
  'AdminDashboard',
  'AdminMetrics',
  'CourseConfig'
];

// Configuração para componentes secundários (carregamento sob demanda)
export const secondaryAdminComponents = [
  'AdminUsers',
  'AdminSettings',
  'AdminUpload',
  'AdminProducts'
];

// Configuração para componentes de configuração avançada (carregamento lazy máximo)
export const advancedConfigComponents = [
  'AdvancedConfig',
  'AppearanceConfig',
  'DomainConfig',
  'EmailConfig',
  'GamificationConfig',
  'SupportConfig',
  'UsersConfig'
];

// === PRELOADING STRATEGY ===

// Hook para precarregar componentes baseado em rota atual
export function useAdminPreloading(currentRoute: string) {
  React.useEffect(() => {
    // Precarregar componentes relacionados baseado na rota atual
    if (currentRoute.includes('/admin')) {
      // Se está na área admin, precarregar dashboard e métricas
      import('@/app/(app)/admin/page');
      import('@/app/(app)/admin/metrics/page');
    }
    
    if (currentRoute.includes('/admin/course-config')) {
      // Se está em configuração de curso, precarregar todas as abas
      import('@/app/(app)/admin/course-config/advanced/page');
      import('@/app/(app)/admin/course-config/appearance/page');
      import('@/app/(app)/admin/course-config/domain/page');
    }
  }, [currentRoute]);
}

// === WRAPPER COM SUSPENSE BOUNDARIES ===

interface AdminSuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminSuspenseWrapper({ 
  children, 
  fallback = <AdminDashboardLoading /> 
}: AdminSuspenseWrapperProps) {
  return (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  );
}

// === MAPA DE ROTAS PARA LAZY COMPONENTS ===

export const adminRouteMap = {
  '/admin': AdminDashboard,
  '/admin/metrics': AdminMetrics,
  '/admin/analytics': AdminAnalytics,
  '/admin/health': AdminHealth,
  '/admin/upload': AdminUpload,
  '/admin/products': AdminProducts,
  '/admin/users': AdminUsers,
  '/admin/moderation': AdminModeration,
  '/admin/settings': AdminSettings,
  '/admin/courses': AdminCourses,
  '/admin/content/new-case': NewCaseContent,
  '/admin/course-config': CourseConfig,
  '/admin/course-config/advanced': AdvancedConfig,
  '/admin/course-config/appearance': AppearanceConfig,
  '/admin/course-config/domain': DomainConfig,
  '/admin/course-config/email': EmailConfig,
  '/admin/course-config/gamification': GamificationConfig,
  '/admin/course-config/support': SupportConfig,
  '/admin/course-config/users': UsersConfig,
} as const;

export type AdminRoute = keyof typeof adminRouteMap;