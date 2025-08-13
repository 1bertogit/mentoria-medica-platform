'use client';

import { GlassCard } from '@/components/shared/glass-card';
import { useAuth } from '@/hooks/use-auth';

interface AdminMetricsProps {
  views: number;
  discussions: number;
  impactFactor: number;
}

export function AdminMetrics({ views, discussions, impactFactor }: AdminMetricsProps) {
  const { user } = useAuth();
  
  // Verificar se o usuário é admin (você pode ajustar esta lógica conforme sua implementação)
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@legacymentoring.com';
  
  if (!isAdmin) {
    return null;
  }

  return (
    <GlassCard className="p-4 sm:p-6">
      <h3 className="mb-4 text-base sm:text-lg font-semibold text-white/90">
        Métricas (Admin)
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Visualizações</span>
          <span className="text-sm font-medium text-white/90">
            {views.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Discussões</span>
          <span className="text-sm font-medium text-white/90">
            {discussions}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Fator de Impacto</span>
          <span className="text-sm font-medium text-white/90">
            {impactFactor}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
