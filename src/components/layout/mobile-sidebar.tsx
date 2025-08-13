'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AppSidebar } from './app-sidebar';

/**
 * MobileSidebar - Sidebar responsiva para mobile
 * Com overlay e animações suaves
 */
export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false); // Sempre inicia fechado

  // Fecha sidebar ao clicar em links ou ao redimensionar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Previne scroll do body quando sidebar está aberta
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Botão Menu Hambúrguer com glassmorphism limpo - Visível apenas em mobile */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 z-[9999] md:hidden",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
          "border border-gray-200/20 dark:border-white/10",
          "hover:bg-white/90 dark:hover:bg-gray-900/90",
          "hover:scale-105 transition-all duration-200",
          "shadow-lg",
          isOpen ? "left-[280px]" : "left-4" // Move o botão quando a sidebar está aberta
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-gray-900 dark:text-white" />
        ) : (
          <Menu className="h-5 w-5 text-gray-900 dark:text-white" />
        )}
      </Button>

      {/* Overlay com glassmorphism sutil - Clique para fechar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9997] md:hidden animate-fadeIn"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Mobile */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-[9998] w-72 transform transition-transform duration-300 ease-out md:hidden overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Wrapper com glassmorphism elegante */}
        <div className="h-full w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-r border-gray-200/20 dark:border-white/10 shadow-xl">
          <AppSidebar onLinkClick={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  );
}

/**
 * MobileHeader - Header otimizado para mobile
 */
export function MobileHeader({ title }: { title?: string }) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass-pane border-b border-white/10 z-30">
      <div className="flex items-center justify-between h-full px-4">
        {/* Espaço para o menu hambúrguer */}
        <div className="w-10" />
        
        {/* Título da página */}
        <h1 className="text-lg font-medium text-white/90 truncate">
          {title || 'Legacy Mentoring'}
        </h1>
        
        {/* Espaço para ações */}
        <div className="w-10" />
      </div>
    </div>
  );
}