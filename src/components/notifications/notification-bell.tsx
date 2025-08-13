'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Eye, EyeOff, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationItem } from './notification-item';
import Link from 'next/link';

interface NotificationBellProps {
  userId?: string;
  className?: string;
}

export function NotificationBell({ userId = '1', className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnread
  } = useNotifications(userId);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Get notifications to display
  const displayNotifications = showUnreadOnly 
    ? getUnread().slice(0, 8)
    : notifications.slice(0, 8);

  const hasUnread = unreadCount > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Bell Button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 hover:bg-white/10 rounded-lg transition-all duration-200 ${
          hasUnread ? 'text-cyan-400' : 'text-gray-600 dark:text-white/60'
        }`}
        aria-label={`Notificações${hasUnread ? ` (${unreadCount} não lidas)` : ''}`}
      >
        <Bell className={`w-5 h-5 ${hasUnread ? 'animate-bell' : ''}`} />
        
        {/* Unread Count Badge */}
        {hasUnread && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div ref={dropdownRef}>
          <GlassCard 
            className="absolute top-full right-0 mt-2 w-80 sm:w-96 max-h-[600px] p-0 overflow-hidden z-50 animate-fadeIn"
          >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white/90">Notificações</h3>
              {hasUnread && (
                <Badge className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5">
                  {unreadCount}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className="p-1 h-7 w-7 hover:bg-white/10"
                title={showUnreadOnly ? 'Mostrar todas' : 'Mostrar apenas não lidas'}
              >
                {showUnreadOnly ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </Button>

              {hasUnread && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="p-1 h-7 w-7 hover:bg-white/10"
                  title="Marcar todas como lidas"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1 h-7 w-7 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                        <div className="h-3 bg-white/5 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayNotifications.length > 0 ? (
              <div className="divide-y divide-white/5">
                {displayNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    compact
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-3" />
                <h4 className="font-medium text-gray-600 dark:text-white/60 mb-1">
                  {showUnreadOnly ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-white/40">
                  {showUnreadOnly 
                    ? 'Você está em dia com suas notificações!' 
                    : 'Novas notificações aparecerão aqui.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 8 && (
            <div className="border-t border-white/10 p-3">
              <div className="flex items-center justify-between">
                <Link href="/notifications">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-cyan-400 hover:text-cyan-300 p-0"
                    onClick={() => setIsOpen(false)}
                  >
                    Ver todas ({notifications.length})
                  </Button>
                </Link>
                
                <Link href="/notifications/settings">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-7 w-7 hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                    title="Configurações"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </GlassCard>
        </div>
      )}
    </div>
  );
}