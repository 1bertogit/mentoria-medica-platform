'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Film, Eye, Download, DollarSign, TrendingUp, 
  Users, Clock, HardDrive, Activity, Calendar
} from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';

interface VideoAnalytics {
  totalVideos: number;
  totalViews: number;
  totalBandwidth: number; // in GB
  estimatedCost: number; // in USD
  storageUsed: number; // in GB
  uniqueViewers: number;
  avgWatchTime: number; // in minutes
  popularVideos: Array<{
    title: string;
    views: number;
    bandwidth: number;
  }>;
  viewsByDay: Array<{
    date: string;
    views: number;
  }>;
  viewsByCategory: Array<{
    category: string;
    count: number;
  }>;
}

export function VideoAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<VideoAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // In production, this would fetch from your API
      // const response = await fetch(`/api/video/analytics?range=${timeRange}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData: VideoAnalytics = {
        totalVideos: 47,
        totalViews: 12543,
        totalBandwidth: 856.3, // GB
        estimatedCost: 72.79, // USD
        storageUsed: 234.5, // GB
        uniqueViewers: 3421,
        avgWatchTime: 18.5, // minutes
        popularVideos: [
          { title: 'Browlift & EndomidFace - Introdução', views: 2341, bandwidth: 156.2 },
          { title: 'Técnica de Deep Plane - Aula Completa', views: 1876, bandwidth: 198.7 },
          { title: 'Frontoplastia Endoscópica', views: 1654, bandwidth: 142.3 },
          { title: 'Cervicoplastia Avançada', views: 1232, bandwidth: 98.4 },
          { title: 'Blefaroplastia Superior', views: 987, bandwidth: 76.5 },
        ],
        viewsByDay: [
          { date: '01/08', views: 423 },
          { date: '02/08', views: 567 },
          { date: '03/08', views: 489 },
          { date: '04/08', views: 612 },
          { date: '05/08', views: 534 },
          { date: '06/08', views: 698 },
          { date: '07/08', views: 745 },
        ],
        viewsByCategory: [
          { category: 'Cursos', count: 8234 },
          { category: 'Gravações', count: 4309 },
        ],
      };

      setAnalytics(mockData);
    } catch (error) {
      logger.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div>Erro ao carregar analytics</div>;
  }

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white/90">Analytics de Vídeo</h2>
          <p className="text-white/60 text-sm mt-1">Monitore o uso e custos da plataforma</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                timeRange === range
                  ? 'bg-cyan-400/20 text-cyan-300'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {range === '7d' ? '7 dias' : range === '30d' ? '30 dias' : '90 dias'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm">Total de Vídeos</p>
              <p className="text-2xl font-semibold text-white/90 mt-1">
                {analytics.totalVideos}
              </p>
              <p className="text-xs text-green-400 mt-2">+5 este mês</p>
            </div>
            <Film className="h-8 w-8 text-cyan-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm">Visualizações</p>
              <p className="text-2xl font-semibold text-white/90 mt-1">
                {analytics.totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-green-400 mt-2">↑ 23% vs mês anterior</p>
            </div>
            <Eye className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm">Bandwidth Usado</p>
              <p className="text-2xl font-semibold text-white/90 mt-1">
                {analytics.totalBandwidth.toFixed(1)} GB
              </p>
              <p className="text-xs text-cyan-400 mt-2">
                {(1024 - analytics.totalBandwidth).toFixed(1)} GB restante (Free Tier)
              </p>
            </div>
            <Download className="h-8 w-8 text-orange-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm">Custo Estimado</p>
              <p className="text-2xl font-semibold text-white/90 mt-1">
                ${analytics.estimatedCost.toFixed(2)}
              </p>
              <Badge className="mt-2 bg-green-500/20 text-green-400">
                Coberto pelos créditos
              </Badge>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </GlassCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Visualizações por Dia
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.viewsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(6,182,212,0.5)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Category Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            Distribuição por Categoria
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.viewsByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, count }) => `${category}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.viewsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(139,92,246,0.5)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Popular Videos Table */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
          <Film className="h-5 w-5 text-orange-400" />
          Vídeos Mais Populares
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/60 text-sm font-normal pb-3">Título</th>
                <th className="text-right text-white/60 text-sm font-normal pb-3">Visualizações</th>
                <th className="text-right text-white/60 text-sm font-normal pb-3">Bandwidth (GB)</th>
                <th className="text-right text-white/60 text-sm font-normal pb-3">Custo Est.</th>
              </tr>
            </thead>
            <tbody>
              {analytics.popularVideos.map((video, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-3 text-white/80">{video.title}</td>
                  <td className="py-3 text-right text-white/60">{video.views.toLocaleString()}</td>
                  <td className="py-3 text-right text-white/60">{video.bandwidth.toFixed(1)}</td>
                  <td className="py-3 text-right text-white/60">
                    ${(video.bandwidth * 0.085).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-cyan-400" />
            <div>
              <p className="text-white/60 text-sm">Espectadores Únicos</p>
              <p className="text-xl font-semibold text-white/90">
                {analytics.uniqueViewers.toLocaleString()}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-white/60 text-sm">Tempo Médio de Visualização</p>
              <p className="text-xl font-semibold text-white/90">
                {analytics.avgWatchTime.toFixed(1)} min
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <HardDrive className="h-8 w-8 text-orange-400" />
            <div>
              <p className="text-white/60 text-sm">Armazenamento S3</p>
              <p className="text-xl font-semibold text-white/90">
                {analytics.storageUsed.toFixed(1)} GB
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* AWS Credits Status */}
      <GlassCard className="p-6 bg-gradient-to-r from-green-500/10 to-cyan-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white/90 mb-2">Status dos Créditos AWS</h3>
            <p className="text-white/60 text-sm">
              Você tem <span className="text-green-400 font-semibold">$927.21</span> em créditos restantes
            </p>
            <p className="text-white/40 text-xs mt-1">
              Com o uso atual, seus créditos durarão aproximadamente 12 meses
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-400">92.7%</p>
            <p className="text-white/60 text-sm">Créditos disponíveis</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}