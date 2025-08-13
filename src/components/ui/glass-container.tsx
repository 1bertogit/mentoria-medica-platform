import { cn } from '@/lib/utils';
import {
  getGlassStyles,
  getGlassPattern,
  type GlassVariant,
  type GlassPattern,
} from '@/lib/styles/glass-morphism';
import { forwardRef } from 'react';

export interface GlassContainerProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Variante pré-definida de glass morphism
   */
  variant?: GlassVariant;

  /**
   * Padrão completo pré-definido
   */
  pattern?: GlassPattern;

  /**
   * Se o container deve ter comportamento interativo
   */
  interactive?: boolean;

  /**
   * Elemento HTML a ser renderizado
   */
  as?: keyof JSX.IntrinsicElements;
}

export const GlassContainer = forwardRef<HTMLElement, GlassContainerProps>(
  (
    {
      className,
      variant,
      pattern,
      interactive = false,
      as = 'div',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = pattern
      ? getGlassPattern(pattern)
      : variant
        ? getGlassStyles(variant)
        : '';

    const interactiveStyles = interactive
      ? 'cursor-pointer hover:scale-[1.02] transition-transform duration-200'
      : '';

    const Component = as as React.ElementType;

    return (
      <Component
        ref={ref}
        className={cn(baseStyles, interactiveStyles, className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlassContainer.displayName = 'GlassContainer';

/**
 * Variantes específicas para casos comuns
 */
export const GlassHeader = forwardRef<
  HTMLElement,
  Omit<GlassContainerProps, 'pattern'>
>(({ className, ...props }, ref) => (
  <GlassContainer
    ref={ref}
    as="header"
    pattern="headerPattern"
    className={cn('', className)}
    {...props}
  />
));

GlassHeader.displayName = 'GlassHeader';

export const GlassSidebar = forwardRef<
  HTMLElement,
  Omit<GlassContainerProps, 'pattern'>
>(({ className, ...props }, ref) => (
  <GlassContainer
    ref={ref}
    as="aside"
    pattern="sidebarPattern"
    className={cn('', className)}
    {...props}
  />
));

GlassSidebar.displayName = 'GlassSidebar';

export const GlassCard = forwardRef<
  HTMLElement,
  Omit<GlassContainerProps, 'pattern'>
>(({ className, interactive = false, ...props }, ref) => (
  <GlassContainer
    ref={ref}
    variant="card"
    interactive={interactive}
    className={cn('rounded-2xl p-6', className)}
    {...props}
  />
));

GlassCard.displayName = 'GlassCard';

export const GlassMobileNav = forwardRef<
  HTMLElement,
  Omit<GlassContainerProps, 'pattern'>
>(({ className, ...props }, ref) => (
  <GlassContainer
    ref={ref}
    as="nav"
    pattern="mobileNavPattern"
    className={cn('', className)}
    {...props}
  />
));

GlassMobileNav.displayName = 'GlassMobileNav';
