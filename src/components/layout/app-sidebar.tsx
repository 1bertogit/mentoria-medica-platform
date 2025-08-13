'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  ChevronLeft,
  Menu,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Biblioteca', href: '/library', icon: BookOpen },
  { name: 'Academy', href: '/academy', icon: GraduationCap },
  { name: 'Casos Clínicos', href: '/cases', icon: FileText },
  { name: 'Calendário', href: '/calendar', icon: Calendar },
  { name: 'Arquivo', href: '/archive', icon: Archive },
  { name: 'Discussões', href: '/discussions', icon: MessageSquare },
];

const adminNavigation = [
  { name: 'Administração', href: '/admin', icon: Shield },
  { name: 'Configuração Curso', href: '/admin/course-config', icon: Settings },
  { name: 'Produtos', href: '/admin/products', icon: Package },
];

interface AppSidebarProps {
  onLinkClick?: () => void;
}

export function AppSidebar({ onLinkClick }: AppSidebarProps = {}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { isAdmin } = useAuth();

  const allNavigation = isAdmin
    ? [...navigation, ...adminNavigation]
    : navigation;

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        'fixed bottom-0 left-0 top-0 flex flex-col transition-all duration-300',
        'bg-white/80 backdrop-blur-xl dark:bg-white/5',
        'border-r border-gray-200/50 dark:border-white/10',
        'z-40',
        // No mobile, a sidebar é controlada pelo MobileSidebar wrapper
        // No desktop, sempre visível
        'md:flex',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="border-b border-gray-200/50 p-4 dark:border-white/10">
        <div className="flex items-center justify-between">
          {/* Logo - Sempre centralizada no mobile */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <img
              src="/images/logos/logo-legacy-mentoring.png"
              alt="Legacy Mentoring"
              className="h-8 w-8 rounded-lg object-contain"
            />
            {/* Nome apenas no desktop quando não colapsado */}
            {!collapsed && (
              <span className="hidden md:inline text-lg font-semibold text-gray-900 dark:text-white">
                Legacy Mentoring
              </span>
            )}
          </Link>
          
          {/* Botão collapse apenas no desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:inline-flex text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white"
          >
            {collapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 space-y-1 px-2 pb-4"
        role="navigation"
        aria-label="Menu principal"
      >
        {allNavigation.map(item => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200',
                isActive
                  ? 'bg-blue-100 text-blue-900 dark:bg-white/15 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Copyright */}
      <div className="mt-auto border-t border-gray-200/50 p-4 dark:border-white/10">
        <p className="text-center text-xs text-gray-500 dark:text-white/50">
          © 2024 Legacy Mentoring
        </p>
      </div>
    </aside>
  );
}
