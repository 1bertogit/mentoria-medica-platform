import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

/**
 * LoadingSpinner - Componente reutilizável de loading
 * Padronizado para toda a aplicação com glass morphism
 */
export function LoadingSpinner({ 
  size = 'md', 
  className,
  label = 'Carregando...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-cyan-500/30 border-t-cyan-500',
          sizeClasses[size]
        )}
        role="status"
        aria-label={label}
      />
      {label && (
        <span className="text-sm text-white/60 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * PageLoader - Loading de página inteira
 */
export function PageLoader({ message = 'Carregando página...' }: { message?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="glass-pane p-8 rounded-lg">
        <LoadingSpinner size="lg" label={message} />
      </div>
    </div>
  );
}

/**
 * InlineLoader - Loading inline para pequenas áreas
 */
export function InlineLoader({ text = 'Processando' }: { text?: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <LoadingSpinner size="sm" className="inline-flex" />
      <span className="text-white/60 text-sm">{text}</span>
    </div>
  );
}