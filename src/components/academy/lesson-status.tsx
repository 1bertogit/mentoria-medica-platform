'use client';

import { CheckCircle, PlayCircle, Lock, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LessonStatusProps {
  status: 'completed' | 'current' | 'locked' | 'available';
  type?:
    | 'video'
    | 'quiz'
    | 'case'
    | 'discussion'
    | 'evaluation'
    | 'certificate';
  duration?: string;
  className?: string;
}

export function LessonStatus({
  status,
  type = 'video',
  duration,
  className = '',
}: LessonStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'current':
        return <PlayCircle className="h-4 w-4 animate-pulse text-cyan-400" />;
      case 'locked':
        return <Lock className="h-4 w-4 text-gray-500" />;
      case 'available':
        return <PlayCircle className="h-4 w-4 text-cyan-400" />;
      default:
        return <PlayCircle className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 border-green-400/30';
      case 'current':
        return 'bg-cyan-500/20 border-cyan-400/30 ring-2 ring-cyan-400/20';
      case 'locked':
        return 'bg-gray-500/20 border-gray-400/30';
      case 'available':
        return 'bg-white/10 border-white/20 hover:bg-cyan-500/20 hover:border-cyan-400/30';
      default:
        return 'bg-white/10 border-white/20';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'quiz':
        return '📝';
      case 'case':
        return '🏥';
      case 'discussion':
        return '💬';
      case 'evaluation':
        return '📊';
      case 'certificate':
        return '🏆';
      default:
        return '🎥';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border ${getStatusColor()} transition-all duration-200`}
      >
        {getStatusIcon()}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span>{getTypeIcon()}</span>
        {duration && (
          <Badge
            variant="outline"
            className="h-4 border-white/20 px-1 py-0 text-xs text-white/60"
          >
            <Clock className="mr-1 h-3 w-3" />
            {duration}
          </Badge>
        )}
      </div>
    </div>
  );
}

export function LessonStatusLegend() {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="mb-3 text-sm font-semibold text-white/90">
        Legenda dos Status
      </h3>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span className="text-white/70">Concluída</span>
        </div>
        <div className="flex items-center gap-2">
          <PlayCircle className="h-4 w-4 animate-pulse text-cyan-400" />
          <span className="text-white/70">Em andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <PlayCircle className="h-4 w-4 text-cyan-400" />
          <span className="text-white/70">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-500" />
          <span className="text-white/70">Bloqueada</span>
        </div>
      </div>
      <div className="mt-3 border-t border-white/10 pt-3">
        <h4 className="mb-2 text-xs font-medium text-white/80">
          Tipos de Conteúdo
        </h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span>🎥</span>
            <span className="text-white/60">Vídeo</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📝</span>
            <span className="text-white/60">Quiz</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏥</span>
            <span className="text-white/60">Caso</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💬</span>
            <span className="text-white/60">Discussão</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📊</span>
            <span className="text-white/60">Avaliação</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏆</span>
            <span className="text-white/60">Certificado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
