'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  MessageSquare, 
  Eye,
  Calendar,
  Download,
  Filter,
  ArrowLeft,
  Activity,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockSystemMetrics, mockUsers, mockModerationQueue } from '@/lib/mock-data/admin';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

type TimeRange = '7d' | '30d' | '90d' | '1y';
type MetricType = 'users' | 'content' | 'engagement' | 'moderation';

export default function Analytics() {
  const { isAdmin } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('users');

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <GlassCard className="p-8 max-w-md text-center">
          <BarChart3 className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white/80 mb-2">Acesso Negado</h2>
          <p className="text-white/60 mb-4">
            Você não tem permissão para acessar os relatórios.
          </p>
          <Link href="/admin">
            <Button className="glass-button">
              Voltar ao Admin
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Últimos 7 dias';
      case '30d': return 'Últimos 30 dias';
      case '90d': return 'Últimos 90 dias';
      case '1y': return 'Último ano';
      default: return 'Últimos 30 dias';
    }
  };

  // Mock data for charts (in a real app, this would come from analytics service)
  const userGrowthData = [
    { period: 'Sem 1', users: 2450, active: 1890 },
    { period: 'Sem 2', users: 2580, active: 1920 },
    { period: 'Sem 3', users: 2720, active: 2010 },
    { period: 'Sem 4', users: 2847, active: 1923 }
  ];

  const contentEngagementData = [
    { type: 'Casos Clínicos', views: 15420, comments: 892, likes: 3450 },
    { type: 'Artigos', views: 8730, comments: 445, likes: 1890 },
    { type: 'Cursos', views: 12560, comments: 678, likes: 2340 },
    { type: 'Discussões', views: 6890, comments: 1234, likes: 890 }
  ];

  const topSpecialties = [
    { name: 'Rinoplastia', users: 145, engagement: 92 },
    { name: 'Mamoplastia', users: 138, engagement: 88 },
    { name: 'Lifting Facial', users: 112, engagement: 85 },
    { name: 'Preenchimentos', users: 98, engagement: 78 },
    { name: 'Blefaroplastia', users: 89, engagement: 74 }
  ];

  const platformActivity = [
    { hour: '00:00', activity: 12 },
    { hour: '06:00', activity: 45 },
    { hour: '12:00', activity: 189 },
    { hour: '18:00', activity: 234 },
    { hour: '23:59', activity: 78 }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <section aria-label="Cabeçalho dos relatórios e analytics">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" className="glass-button hover:scale-105 transition-transform duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-light text-white/90">Analytics & Relatórios</h1>
              <p className="text-white/60">
                Dados e insights da plataforma
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="w-[160px] glass-input">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-pane">
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
              </SelectContent>
            </Select>

            <Button className="glass-button">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section aria-label="Métricas principais">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5%
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white/90 mb-1">
              {mockSystemMetrics.users.total.toLocaleString()}
            </div>
            <div className="text-sm text-white/60">Usuários Totais</div>
            <div className="text-xs text-white/50 mt-1">
              {mockSystemMetrics.users.active} ativos hoje
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8.7%
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white/90 mb-1">
              {(mockSystemMetrics.content.cases + mockSystemMetrics.content.articles).toLocaleString()}
            </div>
            <div className="text-sm text-white/60">Conteúdo Publicado</div>
            <div className="text-xs text-white/50 mt-1">
              {mockSystemMetrics.content.comments.toLocaleString()} comentários
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +15.2%
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white/90 mb-1">
              {mockSystemMetrics.engagement.pageViews.toLocaleString()}
            </div>
            <div className="text-sm text-white/60">Visualizações Hoje</div>
            <div className="text-xs text-white/50 mt-1">
              {mockSystemMetrics.engagement.averageSessionTime}min sessão média
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-yellow-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mockSystemMetrics.moderation.averageResponseTime}h
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white/90 mb-1">
              {mockSystemMetrics.engagement.commentRate * 100}%
            </div>
            <div className="text-sm text-white/60">Taxa de Engajamento</div>
            <div className="text-xs text-white/50 mt-1">
              {mockSystemMetrics.moderation.resolvedToday} moderações hoje
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white/90">Crescimento de Usuários</h3>
            <div className="text-sm text-white/60">{getTimeRangeLabel(timeRange)}</div>
          </div>
          
          <div className="space-y-4">
            {userGrowthData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm text-white/70">{data.period}</div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white/90">{data.users}</div>
                    <div className="text-xs text-white/60">total</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-400">{data.active}</div>
                    <div className="text-xs text-white/60">ativos</div>
                  </div>
                  {/* Simple bar visualization */}
                  <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                      style={{ width: `${(data.active / data.users) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Content Engagement */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white/90">Engajamento por Tipo</h3>
            <div className="text-sm text-white/60">{getTimeRangeLabel(timeRange)}</div>
          </div>
          
          <div className="space-y-4">
            {contentEngagementData.map((data, index) => (
              <div key={index} className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white/90">{data.type}</h4>
                  <div className="text-sm text-cyan-400">{data.views.toLocaleString()} views</div>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {data.comments}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {data.likes}
                  </div>
                  <div className="ml-auto text-white/50">
                    {((data.comments + data.likes) / data.views * 100).toFixed(1)}% engajamento
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Top Specialties */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white/90">Especialidades Populares</h3>
            <div className="text-sm text-white/60">Por número de usuários</div>
          </div>
          
          <div className="space-y-3">
            {topSpecialties.map((specialty, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-white/90">{specialty.name}</div>
                    <div className="text-xs text-white/60">{specialty.users} usuários</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-purple-400">{specialty.engagement}%</div>
                  <div className="text-xs text-white/60">engajamento</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Platform Activity */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white/90">Atividade por Horário</h3>
            <div className="text-sm text-white/60">Usuários ativos</div>
          </div>
          
          <div className="space-y-4">
            {platformActivity.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm text-white/70">{data.hour}</div>
                <div className="flex-1">
                  <div className="w-full h-6 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(data.activity / 250) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {data.activity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Summary Report */}
      <section aria-label="Relatório resumo">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white/90">Resumo Executivo</h3>
            <div className="text-sm text-white/60">{getTimeRangeLabel(timeRange)}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">92.5%</div>
              <div className="text-sm text-white/60">Taxa de Retenção</div>
              <div className="text-xs text-white/50 mt-1">vs. 89.2% mês anterior</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">4.8</div>
              <div className="text-sm text-white/60">Avaliação Média</div>
              <div className="text-xs text-white/50 mt-1">de 5.0 estrelas</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">67%</div>
              <div className="text-sm text-white/60">Usuários Premium</div>
              <div className="text-xs text-white/50 mt-1">vs. 62% mês anterior</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-2">18.5min</div>
              <div className="text-sm text-white/60">Tempo Médio</div>
              <div className="text-xs text-white/50 mt-1">por sessão</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="font-medium text-white/90 mb-3">Insights Principais:</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                <span>O crescimento de usuários ativos aumentou 15.2% em relação ao período anterior</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <span>Rinoplastia continua sendo a especialidade com maior engajamento</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                <span>Pico de atividade ocorre entre 18h-19h, ideal para lançamentos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                <span>Taxa de conversão para premium cresceu 5 pontos percentuais</span>
              </li>
            </ul>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}