'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Heart, 
  UserPlus, 
  CheckCircle, 
  BookOpen, 
  AlertCircle, 
  Trophy,
  Bell,
  Eye,
  Trash2,
  ExternalLink,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Notification } from '@/lib/mock-data/notifications';
import Link from 'next/link';
import Image from 'next/image';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
  onClick?: () => void;
}

const typeIcons = {
  info: AlertCircle,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
  achievement: Trophy,
  reminder: Bell,
  system: AlertCircle,
  comment: MessageSquare,
  reply: MessageSquare,
  like: Heart,
  follow: UserPlus,
  case_approved: CheckCircle,
  course_update: BookOpen,
  discussion: MessageSquare,
};

const typeColors = {
  info: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
  achievement: 'text-pink-400',
  reminder: 'text-cyan-400',
  system: 'text-orange-400',
  comment: 'text-blue-400',
  reply: 'text-cyan-400',
  like: 'text-red-400',
  follow: 'text-green-400',
  case_approved: 'text-emerald-400',
  course_update: 'text-yellow-400',
  discussion: 'text-purple-400',
};

const priorityColors = {
  low: 'border-l-gray-500',
  medium: 'border-l-blue-500',
  high: 'border-l-orange-500',
  urgent: 'border-l-red-500',
};

const categoryBadgeColors = {
  social: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  course: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  achievement: 'bg-green-500/20 text-green-300 border-green-400/30',
  reminder: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
  system: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
  security: 'bg-red-500/20 text-red-300 border-red-400/30',
  content: 'bg-green-500/20 text-green-300 border-green-400/30',
  educational: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  administrative: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  compact = false,
  onClick
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const Icon = typeIcons[notification.type] || Bell;
  const iconColor = typeColors[notification.type] || 'text-gray-600 dark:text-white/60';
  const priorityColor = priorityColors[notification.priority];
  const categoryColor = categoryBadgeColors[notification.category];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMarkAsRead) onMarkAsRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(notification.id);
  };

  const Content = (
    <div
      className={`relative p-4 transition-all duration-200 border-l-2 ${priorityColor} ${
        !notification.isRead ? 'bg-white/5' : 'hover:bg-white/5'
      } ${compact ? 'p-3' : 'p-4'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-${compact ? '8' : '10'} h-${compact ? '8' : '10'} rounded-lg bg-white/5 flex items-center justify-center`}>
          {notification.metadata?.authorAvatar ? (
            <Image
              src={notification.metadata.authorAvatar}
              alt={notification.metadata.authorName || 'Avatar'}
              width={compact ? 32 : 40}
              height={compact ? 32 : 40}
              className="rounded-lg object-cover"
            />
          ) : notification.metadata?.imageUrl ? (
            <Image
              src={notification.metadata.imageUrl}
              alt={notification.title}
              width={compact ? 32 : 40}
              height={compact ? 32 : 40}
              className="rounded-lg object-cover"
            />
          ) : (
            <Icon className={`w-${compact ? '4' : '5'} h-${compact ? '4' : '5'} ${iconColor}`} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-medium text-gray-900 dark:text-white/90 leading-tight ${
              compact ? 'text-sm' : 'text-base'
            }`}>
              {notification.title}
            </h4>
            
            {!compact && (
              <div className="flex items-center gap-1">
                <Badge className={`text-xs px-2 py-0.5 ${categoryColor}`}>
                  {notification.category}
                </Badge>
                {isHovered && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-white/10"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-pane">
                      {!notification.isRead && onMarkAsRead && (
                        <DropdownMenuItem onClick={handleMarkAsRead} className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2" />
                          Marcar como lida
                        </DropdownMenuItem>
                      )}
                      {notification.actionUrl && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <a href={notification.actionUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Abrir link
                          </a>
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem 
                          onClick={handleDelete} 
                          className="cursor-pointer text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>

          <p className={`text-gray-700 dark:text-white/70 leading-relaxed mb-2 ${
            compact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'
          }`}>
            {notification.message}
          </p>

          {/* Preview text */}
          {!compact && notification.metadata?.previewText && (
            <p className="text-xs text-gray-500 dark:text-white/50 italic mb-2 line-clamp-1">
              "{notification.metadata.previewText}"
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/50">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(notification.createdAt)}</span>
              </div>
              
              {notification.metadata?.authorName && (
                <span>por {notification.metadata.authorName}</span>
              )}
              
              {notification.metadata?.count && (
                <span>{notification.metadata.count} pessoas</span>
              )}
            </div>

            {compact && !notification.isRead && onMarkAsRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAsRead}
                className="h-6 px-2 text-xs hover:bg-white/10"
              >
                Marcar como lida
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // If there's an action URL, wrap in Link
  if (notification.actionUrl && !compact) {
    return (
      <Link href={notification.actionUrl} className="block hover:bg-white/5 transition-colors">
        {Content}
      </Link>
    );
  }

  return Content;
}