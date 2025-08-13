'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  AlertTriangle,
  Activity,
  TrendingUp,
  Shield,
  Settings,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Package,
} from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  mockSystemMetrics,
  mockActivityLogs,
  mockModerationQueue,
  type ActivityLog,
} from '@/lib/mock-data/admin';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [metrics] = useState(mockSystemMetrics);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [pendingModeration] = useState(
    mockModerationQueue.filter(item => item.status === 'pending')
  );

  useEffect(() => {
    // Get recent activity (last 10 items)
    const sortedActivity = mockActivityLogs
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);
    setRecentActivity(sortedActivity);
  }, []);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
        <GlassCard className="max-w-md p-8 text-center">
          <Shield className="mx-auto mb-4 h-16 w-16 text-red-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/80">
            Acesso Negado
          </h2>
          <p className="mb-4 text-gray-600 dark:text-white/60">
            Você não tem permissão para acessar a área administrativa.
          </p>
          <Link href="/dashboard">
            <Button className="glass-button">Voltar ao Dashboard</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-500/20';
      case 'error':
        return 'text-orange-400 bg-orange-500/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'info':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <section aria-label="Cabeçalho administrativo">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-900 dark:text-white/90">
                Painel Administrativo
              </h1>
              <p className="text-gray-600 dark:text-white/60">
                Gerencie usuários, conteúdo e configurações da plataforma
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/settings">
              <Button className="glass-button">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section aria-label="Estatísticas principais">
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <GlassCard className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <Badge className="bg-green-500/20 text-xs text-green-300">
                +{metrics.users.new} hoje
              </Badge>
            </div>
            <div className="mb-1 text-2xl font-bold text-white/90">
              {metrics.users.total.toLocaleString()}
            </div>
            <div className="text-sm text-white/60">Usuários Totais</div>
            <div className="mt-1 text-xs text-white/50">
              {metrics.users.active} ativos
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                <FileText className="h-5 w-5 text-green-400" />
              </div>
              <Badge className="bg-blue-500/20 text-xs text-blue-300">
                {metrics.content.cases} casos
              </Badge>
            </div>
            <div className="mb-1 text-2xl font-bold text-white/90">
              {(
                metrics.content.cases +
                metrics.content.articles +
                metrics.content.discussions
              ).toLocaleString()}
            </div>
            <div className="text-sm text-white/60">Conteúdo Total</div>
            <div className="mt-1 text-xs text-white/50">
              {metrics.content.comments.toLocaleString()} comentários
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <Badge className="bg-red-500/20 text-xs text-red-300">
                {metrics.moderation.pendingReviews} pendentes
              </Badge>
            </div>
            <div className="mb-1 text-2xl font-bold text-white/90">
              {metrics.moderation.flaggedContent}
            </div>
            <div className="text-sm text-white/60">Conteúdo Sinalizado</div>
            <div className="mt-1 text-xs text-white/50">
              {metrics.moderation.averageResponseTime}h resposta
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
              <Badge className="bg-green-500/20 text-xs text-green-300">
                {metrics.engagement.dailyActiveUsers} DAU
              </Badge>
            </div>
            <div className="mb-1 text-2xl font-bold text-white/90">
              {metrics.engagement.pageViews.toLocaleString()}
            </div>
            <div className="text-sm text-white/60">Views Hoje</div>
            <div className="mt-1 text-xs text-white/50">
              {metrics.engagement.averageSessionTime}min sessão
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Quick Actions */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick Actions */}
          <GlassCard className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-white/90">
              Ações Rápidas
            </h2>
            <div className="space-y-3">
              <Link href="/admin/users">
                <Button className="glass-button w-full justify-start">
                  <Users className="mr-3 h-4 w-4" />
                  Gerenciar Usuários
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button className="glass-button w-full justify-start">
                  <Package className="mr-3 h-4 w-4" />
                  Gerenciar Produtos
                </Button>
              </Link>
              <Link href="/admin/moderation">
                <Button className="glass-button w-full justify-start">
                  <Shield className="mr-3 h-4 w-4" />
                  Fila de Moderação
                  {pendingModeration.length > 0 && (
                    <Badge className="ml-auto bg-red-500/20 text-red-300">
                      {pendingModeration.length}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button className="glass-button w-full justify-start">
                  <BarChart3 className="mr-3 h-4 w-4" />
                  Analytics & Relatórios
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button className="glass-button w-full justify-start">
                  <Settings className="mr-3 h-4 w-4" />
                  Configurações
                </Button>
              </Link>
            </div>
          </GlassCard>

          {/* Pending Moderation Preview */}
          {pendingModeration.length > 0 && (
            <GlassCard className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-white/90">
                  Moderação Pendente
                </h3>
                <Link href="/admin/moderation">
                  <Button size="sm" className="glass-button text-xs">
                    Ver Todos
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {pendingModeration.slice(0, 3).map(item => (
                  <div key={item.id} className="rounded-lg bg-white/5 p-3">
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="line-clamp-1 text-sm font-medium text-white/90">
                        {item.title}
                      </h4>
                      <Badge
                        className={`text-xs ${item.priority === 'high' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}
                      >
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="mb-2 text-xs text-white/60">
                      por {item.author.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="glass-button h-6 bg-green-500/20 px-2 text-xs text-green-300"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        className="glass-button h-6 bg-red-500/20 px-2 text-xs text-red-300"
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column - Activity Feed */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Activity */}
          <GlassCard className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90">
                Atividade Recente
              </h2>
              <Link href="/admin/logs">
                <Button size="sm" className="glass-button">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Todos
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivity.map(log => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 rounded-lg bg-white/5 p-4"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${getSeverityColor(log.severity)}`}
                  >
                    {log.type === 'moderation' && (
                      <Shield className="h-4 w-4" />
                    )}
                    {log.type === 'user_action' && (
                      <Users className="h-4 w-4" />
                    )}
                    {log.type === 'system_event' && (
                      <Settings className="h-4 w-4" />
                    )}
                    {log.type === 'security' && (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between">
                      <h4 className="text-sm font-medium text-white/90">
                        {log.message}
                      </h4>
                      <Badge
                        className={`text-xs ${getSeverityColor(log.severity)}`}
                      >
                        {log.severity}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span>{formatDate(log.timestamp)}</span>
                      {log.userName && <span>por {log.userName}</span>}
                      {log.ip && <span>IP: {log.ip}</span>}
                    </div>

                    {/* Details section temporarily removed due to type issues */}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
