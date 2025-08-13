'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Hook para gerenciar estado ativo de rotas
 * Elimina duplicação de lógica de detecção de rota ativa
 */
export function useActiveRoute() {
  const pathname = usePathname();

  const isRouteActive = useMemo(() => {
    return (href: string): boolean => {
      return pathname === href || pathname.startsWith(href + '/');
    };
  }, [pathname]);

  const getActiveLinkClasses = useMemo(() => {
    return (
      href: string,
      activeClasses: string,
      inactiveClasses: string
    ): string => {
      return isRouteActive(href) ? activeClasses : inactiveClasses;
    };
  }, [isRouteActive]);

  const isExactRoute = useMemo(() => {
    return (href: string): boolean => {
      return pathname === href;
    };
  }, [pathname]);

  const hasActiveChild = useMemo(() => {
    return (basePath: string): boolean => {
      return pathname.startsWith(basePath + '/') && pathname !== basePath;
    };
  }, [pathname]);

  return {
    pathname,
    isRouteActive,
    getActiveLinkClasses,
    isExactRoute,
    hasActiveChild,
  };
}

/**
 * Hook específico para navegação com classes pré-definidas
 */
export function useNavigation() {
  const { isRouteActive, getActiveLinkClasses } = useActiveRoute();

  const getLinkClasses = (
    href: string,
    variant: 'sidebar' | 'mobile' = 'sidebar'
  ): string => {
    const baseClasses =
      'flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200';

    const variants = {
      sidebar: {
        active: 'bg-blue-100 text-blue-900 dark:bg-white/15 dark:text-white',
        inactive:
          'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white',
      },
      mobile: {
        active: 'text-cyan-400',
        inactive: 'text-white/60 hover:text-white',
      },
    };

    return `${baseClasses} ${getActiveLinkClasses(
      href,
      variants[variant].active,
      variants[variant].inactive
    )}`;
  };

  const getMobileLinkClasses = (href: string): string => {
    return getActiveLinkClasses(
      href,
      'text-cyan-400',
      'text-white/60 hover:text-white'
    );
  };

  return {
    isRouteActive,
    getLinkClasses,
    getMobileLinkClasses,
  };
}
