import {
  Home,
  BookOpen,
  GraduationCap,
  FileText,
  Archive,
  MessageSquare,
  Calendar,
  Shield,
  Package,
  Settings,
  User,
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: typeof Home;
  adminOnly?: boolean;
}

// Navegação principal do aplicativo
export const MAIN_NAVIGATION: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Biblioteca', href: '/library', icon: BookOpen },
  { name: 'Academy', href: '/academy', icon: GraduationCap },
  { name: 'Casos Clínicos', href: '/cases', icon: FileText },
  { name: 'Calendário', href: '/calendar', icon: Calendar },
  { name: 'Arquivo', href: '/archive', icon: Archive },
  { name: 'Discussões', href: '/discussions', icon: MessageSquare },
];

// Navegação administrativa
export const ADMIN_NAVIGATION: NavigationItem[] = [
  { name: 'Administração', href: '/admin', icon: Shield, adminOnly: true },
  {
    name: 'Configuração Curso',
    href: '/admin/course-config',
    icon: Settings,
    adminOnly: true,
  },
  { name: 'Produtos', href: '/admin/products', icon: Package, adminOnly: true },
];

// Navegação de usuário
export const USER_NAVIGATION: NavigationItem[] = [
  { name: 'Conta', href: '/profile', icon: User },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

// Navegação para mobile (bottom nav) - versão compacta
export const MOBILE_NAVIGATION: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Biblioteca', href: '/library', icon: BookOpen },
  { name: 'Academy', href: '/academy', icon: GraduationCap },
  { name: 'Casos', href: '/cases', icon: FileText },
  { name: 'Arquivo', href: '/archive', icon: Archive },
];

// Função para combinar navegações baseado no perfil do usuário
export function getNavigationForUser(
  isAdmin: boolean = false
): NavigationItem[] {
  return isAdmin ? [...MAIN_NAVIGATION, ...ADMIN_NAVIGATION] : MAIN_NAVIGATION;
}

// Função para verificar se uma rota está ativa
export function isRouteActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}
