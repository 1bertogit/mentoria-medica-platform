/**
 * Utilitários para Glass Morphism - Elimina duplicação de estilos backdrop-blur
 */

export const GLASS_VARIANTS = {
  // Containers principais
  header:
    'bg-white/80 backdrop-blur-xl dark:bg-white/5 border-b border-gray-200/50 dark:border-white/10',
  sidebar:
    'bg-white/80 backdrop-blur-xl dark:bg-white/5 border-r border-gray-200/50 dark:border-white/10',
  bottomNav: 'bg-white/5 backdrop-blur-xl border-t border-white/10',

  // Cards e containers
  card: 'backdrop-blur-xl bg-white/5 border border-white/10',
  cardLight: 'backdrop-blur-sm bg-white/10 border border-white/20',

  // Forms e inputs
  input:
    'border-white/20 bg-white/10 backdrop-blur-sm focus:border-white/40 focus:bg-white/15',
  inputError: 'border-red-500/30 bg-red-500/10 backdrop-blur-sm',
  inputSuccess: 'border-green-500/30 bg-green-500/10 backdrop-blur-sm',

  // Auth pages
  authContainer:
    'backdrop-blur-2xl backdrop-saturate-200 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent',
  authCard: 'bg-white/10 backdrop-blur-lg border border-white/20',

  // Premium Login variants
  premiumLoginCard:
    'backdrop-blur-[20px] saturate-[180%] bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent border border-white/[0.125]',
  premiumLoginInput:
    'border-white/20 bg-white/10 backdrop-blur-sm focus:border-yellow-400/40 focus:bg-white/15 transition-all duration-200',
  goldGlassButton:
    'bg-gradient-to-r from-yellow-400/20 via-amber-500/15 to-yellow-600/20 backdrop-blur-sm border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300',

  // Overlays e modais
  overlay: 'backdrop-blur-sm bg-black/50',
  modal: 'backdrop-blur-xl bg-white/95 dark:bg-white/10 border border-white/20',

  // Estados hover/focus
  hover: 'hover:bg-white/15 transition-all duration-200',
  focus: 'focus:bg-white/15 focus:border-white/30',

  // Skeleton e loading
  skeleton: 'backdrop-blur-xl bg-white/5 border border-white/10 animate-pulse',
} as const;

export type GlassVariant = keyof typeof GLASS_VARIANTS;

/**
 * Retorna as classes CSS para uma variante de glass morphism
 */
export function getGlassStyles(variant: GlassVariant): string {
  return GLASS_VARIANTS[variant];
}

/**
 * Combina múltiplas variantes de glass morphism
 */
export function combineGlassStyles(...variants: GlassVariant[]): string {
  return variants.map(variant => GLASS_VARIANTS[variant]).join(' ');
}

/**
 * Glass morphism com customização adicional
 */
export function glassWithCustom(
  variant: GlassVariant,
  customClasses: string = ''
): string {
  return `${GLASS_VARIANTS[variant]} ${customClasses}`.trim();
}

/**
 * Padrões comuns de glass morphism para diferentes componentes
 */
export const GLASS_PATTERNS = {
  // Padrão completo para headers
  headerPattern: `sticky top-0 z-50 w-full ${GLASS_VARIANTS.header}`,

  // Padrão para sidebar colapsável
  sidebarPattern: `fixed bottom-0 left-0 top-0 z-40 flex flex-col transition-all duration-300 ${GLASS_VARIANTS.sidebar}`,

  // Padrão para cards interativos
  interactiveCard: `${GLASS_VARIANTS.card} transition-all duration-300 hover:scale-[1.02] cursor-pointer`,

  // Padrão para inputs com estados
  inputWithStates: `${GLASS_VARIANTS.input} transition-all duration-200 hover:bg-white/15`,

  // Padrão para mobile bottom navigation
  mobileNavPattern: `fixed bottom-0 left-0 right-0 z-50 lg:hidden ${GLASS_VARIANTS.bottomNav}`,

  // Padrão para auth forms
  authFormPattern: `relative overflow-hidden rounded-3xl p-8 shadow-2xl ${GLASS_VARIANTS.authContainer}`,

  // Premium Login patterns
  premiumLoginPattern: `relative overflow-hidden rounded-3xl p-8 shadow-2xl ${GLASS_VARIANTS.premiumLoginCard}`,
  goldButtonPattern: `relative overflow-hidden rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-[1.02] ${GLASS_VARIANTS.goldGlassButton}`,
} as const;

export type GlassPattern = keyof typeof GLASS_PATTERNS;

/**
 * Retorna um padrão completo de glass morphism
 */
export function getGlassPattern(pattern: GlassPattern): string {
  return GLASS_PATTERNS[pattern];
}
