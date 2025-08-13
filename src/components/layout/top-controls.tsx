'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, X, MessageSquare, Heart, AlertCircle, Sun, Moon, Globe, User, LogOut, HelpCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Mock data para notificações
const mockNotifications = [
  {
    id: 1,
    type: 'comment',
    title: 'Novo comentário',
    message: 'Dr. Ana Silva comentou no seu caso "Rinoplastia Secundária"',
    time: '2 min atrás',
    read: false,
  },
  {
    id: 2,
    type: 'like',
    title: 'Curtida recebida',
    message: 'Dr. Carlos Mendes curtiu seu artigo sobre Blefaroplastia',
    time: '1 hora atrás',
    read: false,
  },
  {
    id: 3,
    type: 'system',
    title: 'Nova masterclass',
    message: 'A masterclass "Lifting Facial Profundo" está disponível',
    time: '3 horas atrás',
    read: true,
  },
];

export function TopControls() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const { theme, setTheme } = useTheme();
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const profileRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  // Fechar menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed top-0 right-0 px-4 py-3 md:px-6 lg:px-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-bl-2xl shadow-sm z-50">
      <div className="flex items-center gap-3">
      {/* Theme Toggle - Modo escuro/claro */}
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 p-0 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80 transition-colors"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-gray-700" />
        )}
      </Button>

      {/* Language Selector */}
      <div className="relative" ref={languageRef}>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 px-3 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80 flex items-center gap-2 transition-colors"
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          title="Idioma"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">
            {languages.find(l => l.code === currentLanguage)?.flag}
          </span>
        </Button>
        
        {/* Language Dropdown */}
        {showLanguageMenu && (
          <div className="absolute right-0 top-12 mt-1 w-40 rounded-xl bg-white/90 backdrop-blur-md p-1 shadow-lg dark:bg-gray-900/90">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setCurrentLanguage(lang.code);
                  setShowLanguageMenu(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                  currentLanguage === lang.code
                    ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400"
                    : "hover:bg-gray-100 dark:hover:bg-white/5"
                )}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications Button - Sem bordas pesadas */}
      <Button
        variant="ghost"
        size="sm"
        className="relative h-10 w-10 p-0 rounded-full hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors"
        title="Notificações"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5 text-gray-700 dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* User Profile with Dropdown Menu */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="h-10 w-10 rounded-full overflow-hidden shadow-md hover:scale-105 transition-transform focus:outline-none"
          title="Menu do Perfil"
        >
          <Image
            src="/images/doctors/Dr-Roberio.png"
            alt="Dr. Robério"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </button>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div className="absolute right-0 top-12 mt-1 w-56 rounded-xl bg-white/90 backdrop-blur-md p-2 shadow-lg dark:bg-gray-900/90">
            {/* User Info Section */}
            <div className="border-b border-gray-200/50 dark:border-white/10 pb-2 mb-2 px-2">
              <p className="font-semibold text-gray-900 dark:text-white">Dr. Robério</p>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              <Link
                href="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Meu Perfil</span>
              </Link>

              <Link
                href="/help"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Ajuda e Suporte</span>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-200/50 dark:border-white/10 my-2"></div>

              {/* Logout */}
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  // Adicionar lógica de logout aqui
                  window.location.href = '/auth/signin';
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications Popup */}
      {showNotifications && (
        <div className="absolute right-0 top-12 mt-2 w-80" ref={notificationRef}>
          <div className="max-h-96 overflow-y-auto rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-lg dark:bg-gray-900/90">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notificações
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {mockNotifications.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-white/60">
                  Nenhuma notificação
                </p>
              ) : (
                mockNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`cursor-pointer rounded-lg p-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-white/5 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-500/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="leading-relaxed text-gray-700 dark:text-white/70">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-white/50">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {mockNotifications.length > 0 && (
              <div className="mt-4 border-t border-gray-200/50 pt-3 dark:border-white/10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white"
                >
                  Ver todas as notificações
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
