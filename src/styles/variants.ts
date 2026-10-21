import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Standard focus-visible ring styles for accessible keyboard navigation.
 */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950'

/**
 * Standard smooth transition presets.
 */
export const transitionBase = 'transition-all duration-200 ease-in-out'

/**
 * Reusable radius definitions across the design system.
 */
export const radiusVariants = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const

/**
 * Elevation / Shadow definitions across the design system.
 */
export const elevationVariants = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  inner: 'shadow-inner',
  glow: 'shadow-[0_0_15px_rgba(99,102,241,0.35)]',
} as const

/**
 * Standard component size variants.
 */
export const sizeVariants = {
  xs: 'text-xs px-2 py-1 gap-1',
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2.5',
  xl: 'text-lg px-6 py-3 gap-3',
} as const

/**
 * Semantic intent and visual styles.
 */
export const intentVariants = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-600',
  secondary:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-500 dark:hover:bg-emerald-600',
  warning:
    'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600',
  destructive:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 dark:bg-rose-500 dark:hover:bg-rose-600',
  info: 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 dark:bg-sky-500 dark:hover:bg-sky-600',
  outline:
    'border border-slate-300 bg-transparent text-slate-800 hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800',
} as const

/**
 * Palette color token mapping for badges, indicators, and thematic accents.
 */
export const colorVariants = {
  slate: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
  sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
} as const

/**
 * General surface variant generator combining intent, radius, and elevation.
 */
export const surfaceVariants = cva(
  'border border-transparent select-none font-medium inline-flex items-center justify-center transition-colors',
  {
    variants: {
      intent: intentVariants,
      size: sizeVariants,
      radius: radiusVariants,
      elevation: elevationVariants,
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      radius: 'md',
      elevation: 'none',
    },
  },
)

export type SurfaceVariantsProps = VariantProps<typeof surfaceVariants>
export { cva, type VariantProps }
