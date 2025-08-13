'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Activity,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
} from 'lucide-react';

interface MetricsData {
  userMetrics: {
    totalLogins: number;
    activeUsers: number;
    newSignups: number;
  };
  courseMetrics: {
    totalViews: number;
    enrollments: number;
    completions: number;
  };
  performanceMetrics: {
    avgLatency: number;
    errorRate: number;
    uptime: number;
  };
  timeSeriesData: Array<{
    time: string;
    logins: number;
    views: number;
    errors: number;
  }>;
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/metrics?range=${timeRange}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      logger.error('Error fetching metrics:', error);
      // Use mock data for demo
      setMetrics(getMockMetrics());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockMetrics = (): MetricsData => ({
    userMetrics: {
      totalLogins: 1247,
      activeUsers: 342,
      newSignups: 28,
    },
    courseMetrics: {
      totalViews: 5823,
      enrollments: 156,
      completions: 47,
    },
    performanceMetrics: {
      avgLatency: 145,
      errorRate: 0.2,
      uptime: 99.9,
    },
    timeSeriesData: [
      { time: '00:00', logins: 45, views: 123, errors: 1 },
      { time: '04:00', logins: 23, views: 67, errors: 0 },
      { time: '08:00', logins: 156, views: 412, errors: 2 },
      { time: '12:00', logins: 234, views: 623, errors: 1 },
      { time: '16:00', logins: 189, views: 534, errors: 3 },
      { time: '20:00', logins: 267, views: 712, errors: 1 },
      { time: '23:59', logins: 78, views: 234, errors: 0 },
    ],
  });

  const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

  const pieData = [
    { name: 'Desktop', value: 65 },
    { name: 'Mobile', value: 30 },
    { name: 'Tablet', value: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              CloudWatch Metrics Dashboard
            </h1>
            <p className="text-gray-400">
              Monitoramento em tempo real da plataforma
            </p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="1h">Última hora</option>
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
            </select>
            
            <Button
              onClick={fetchMetrics}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Usuários Ativos</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.userMetrics.activeUsers || 0}
                </p>
                <p className="text-green-400 text-sm mt-2">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +12% vs ontem
                </p>
              </div>
              <Users className="w-10 h-10 text-cyan-400" />
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Views de Cursos</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.courseMetrics.totalViews || 0}
                </p>
                <p className="text-green-400 text-sm mt-2">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +23% vs ontem
                </p>
              </div>
              <Eye className="w-10 h-10 text-purple-400" />
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Latência Média</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.performanceMetrics.avgLatency || 0}ms
                </p>
                <p className="text-green-400 text-sm mt-2">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  -5ms vs ontem
                </p>
              </div>
              <Clock className="w-10 h-10 text-green-400" />
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Taxa de Erro</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics?.performanceMetrics.errorRate || 0}%
                </p>
                <p className="text-green-400 text-sm mt-2">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  -0.1% vs ontem
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-400" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Activity Timeline */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Atividade ao Longo do Tempo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics?.timeSeriesData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="time" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="logins"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  name="Logins"
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Views"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Device Distribution */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Distribuição por Dispositivo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Course Performance */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Performance dos Cursos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Rinoplastia', views: 1234, enrollments: 89, completions: 45 },
                { name: 'Blefaroplastia', views: 987, enrollments: 67, completions: 34 },
                { name: 'Lifting', views: 1456, enrollments: 123, completions: 78 },
                { name: 'Mamoplastia', views: 876, enrollments: 56, completions: 23 },
                { name: 'Lipoaspiração', views: 654, enrollments: 45, completions: 12 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
              <Legend />
              <Bar dataKey="views" fill="#06b6d4" name="Visualizações" />
              <Bar dataKey="enrollments" fill="#8b5cf6" name="Inscrições" />
              <Bar dataKey="completions" fill="#10b981" name="Conclusões" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* System Health */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-green-500/10 border-green-500/20 p-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-green-400 font-semibold">Sistema Operacional</p>
                <p className="text-white text-sm">Uptime: 99.9%</p>
              </div>
            </div>
          </Card>

          <Card className="bg-yellow-500/10 border-yellow-500/20 p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-semibold">2 Alertas Ativos</p>
                <p className="text-white text-sm">Verificar logs</p>
              </div>
            </div>
          </Card>

          <Card className="bg-cyan-500/10 border-cyan-500/20 p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-cyan-400 font-semibold">CloudWatch Ativo</p>
                <p className="text-white text-sm">Última atualização: 2 min</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}