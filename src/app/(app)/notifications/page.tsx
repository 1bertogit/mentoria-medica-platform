'use client';

import { useState } from 'react';
import { Bell, Check, Filter, Search, Settings, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationItem } from '@/components/notifications/notification-item';
import Link from 'next/link';

type FilterType = 'all' | 'unread' | 'read';
type CategoryFilter = 'all' | 'social' | 'content' | 'educational' | 'system' | 'administrative';
type PriorityFilter = 'all' | 'urgent' | 'high' | 'medium' | 'low';

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    stats
  } = useNotifications();

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.metadata?.authorName?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Read/unread filter
    if (filterType === 'unread' && notification.isRead) return false;
    if (filterType === 'read' && !notification.isRead) return false;

    // Category filter
    if (categoryFilter !== 'all' && notification.category !== categoryFilter) return false;

    // Priority filter
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false;

    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <section aria-label="Cabeçalho das notificações">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-900 dark:text-white/90">Notificações</h1>
              <p className="text-gray-600 dark:text-white/60">
                Gerencie suas notificações e configurações
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                className="glass-button bg-green-500/20 text-green-300 hover:bg-green-500/30"
              >
                <Check className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
            
            <Link href="/notifications/settings">
              <Button className="glass-button">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-1">
              {stats.totalCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-white/60">Total</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {stats.unreadCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-white/60">Não lidas</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {stats.byCategory.social}
            </div>
            <div className="text-sm text-gray-600 dark:text-white/60">Sociais</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {stats.byCategory.content}
            </div>
            <div className="text-sm text-gray-600 dark:text-white/60">Conteúdo</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {stats.byCategory.educational}
            </div>
            <div className="text-sm text-gray-600 dark:text-white/60">Educacional</div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/40" />
              <Input
                type="text"
                placeholder="Buscar notificações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                <SelectTrigger className="w-[140px] glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-pane">
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Todas
                    </div>
                  </SelectItem>
                  <SelectItem value="unread">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4" />
                      Não lidas
                    </div>
                  </SelectItem>
                  <SelectItem value="read">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Lidas
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}>
                <SelectTrigger className="w-[140px] glass-input">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="glass-pane">
                  <SelectItem value="all">Todas categorias</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="content">Conteúdo</SelectItem>
                  <SelectItem value="educational">Educacional</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                  <SelectItem value="administrative">Administrativa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as PriorityFilter)}>
                <SelectTrigger className="w-[120px] glass-input">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent className="glass-pane">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Notifications List */}
      <section aria-label="Lista de notificações">
        {isLoading ? (
          <GlassCard className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4"></div>
                      <div className="h-3 bg-white/5 rounded w-1/2"></div>
                      <div className="h-2 bg-white/5 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        ) : filteredNotifications.length > 0 ? (
          <GlassCard className="p-0 overflow-hidden">
            <div className="divide-y divide-white/5">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400 dark:text-white/40" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/80 mb-2">
                  {searchQuery || filterType !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Nenhuma notificação encontrada'
                    : 'Nenhuma notificação'
                  }
                </h3>
                <p className="text-gray-600 dark:text-white/60 max-w-md">
                  {searchQuery || filterType !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Tente ajustar os filtros para encontrar o que procura.'
                    : 'Você receberá notificações sobre atividades relacionadas ao seu perfil.'
                  }
                </p>
              </div>
              {(searchQuery || filterType !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all') && (
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setCategoryFilter('all');
                    setPriorityFilter('all');
                  }}
                  className="glass-button mt-2"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </GlassCard>
        )}
      </section>
    </div>
  );
}