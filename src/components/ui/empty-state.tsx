import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * EmptyState - Componente padronizado para estados vazios
 * Usado quando não há dados para exibir
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      'glass-pane p-12 text-center rounded-lg',
      'flex flex-col items-center justify-center',
      'min-h-[300px]',
      className
    )}>
      {/* Ícone com gradiente */}
      <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
        <Icon className="w-12 h-12 text-white/40" />
      </div>
      
      {/* Título */}
      <h3 className="text-lg font-medium text-white/90 mb-2">
        {title}
      </h3>
      
      {/* Descrição */}
      {description && (
        <p className="text-white/60 max-w-md mx-auto mb-6">
          {description}
        </p>
      )}
      
      {/* Ação */}
      {action && (
        <Button 
          onClick={action.onClick}
          className="glass-button hover:scale-105 transition-transform"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * SearchEmptyState - Estado vazio específico para buscas
 */
export function SearchEmptyState({ 
  searchTerm,
  onClear 
}: { 
  searchTerm: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={require('lucide-react').Search}
      title="Nenhum resultado encontrado"
      description={`Não encontramos resultados para "${searchTerm}". Tente ajustar os filtros ou termos de busca.`}
      action={onClear ? {
        label: 'Limpar busca',
        onClick: onClear
      } : undefined}
    />
  );
}