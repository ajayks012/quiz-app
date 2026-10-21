import { cva } from 'class-variance-authority'

export const headingVariants = cva(
  'font-display tracking-tight text-slate-900 dark:text-slate-50',
  {
    variants: {
      level: {
        display: 'text-4xl sm:text-5xl lg:text-6xl font-extrabold',
        h1: 'text-3xl sm:text-4xl font-bold',
        h2: 'text-2xl sm:text-3xl font-bold',
        h3: 'text-xl sm:text-2xl font-semibold',
        h4: 'text-lg sm:text-xl font-semibold',
        h5: 'text-base sm:text-lg font-medium',
        h6: 'text-sm sm:text-base font-medium',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      level: 'h1',
      align: 'left',
    },
  },
)

export const textVariants = cva('font-sans leading-relaxed', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    tone: {
      default: 'text-slate-800 dark:text-slate-200',
      muted: 'text-slate-500 dark:text-slate-400',
      accent: 'text-indigo-600 dark:text-indigo-400',
      destructive: 'text-rose-600 dark:text-rose-400',
      success: 'text-emerald-600 dark:text-emerald-400',
      warning: 'text-amber-600 dark:text-amber-400',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    truncate: {
      true: 'truncate',
      false: '',
    },
  },
  defaultVariants: {
    size: 'base',
    tone: 'default',
    weight: 'normal',
    align: 'left',
    truncate: false,
  },
})

export const labelVariants = cva(
  'font-sans font-medium inline-flex items-center text-slate-700 dark:text-slate-300 select-none',
  {
    variants: {
      size: {
        sm: 'text-xs gap-1',
        md: 'text-sm gap-1.5',
        lg: 'text-base gap-2',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
      error: {
        true: 'text-rose-600 dark:text-rose-400',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      disabled: false,
      error: false,
    },
  },
)

export const captionVariants = cva('font-sans tracking-normal leading-normal', {
  variants: {
    size: {
      xs: 'text-[11px]',
      sm: 'text-xs',
    },
    tone: {
      default: 'text-slate-500 dark:text-slate-400',
      muted: 'text-slate-400 dark:text-slate-500',
      error: 'text-rose-500 dark:text-rose-400',
      success: 'text-emerald-600 dark:text-emerald-400',
    },
  },
  defaultVariants: {
    size: 'sm',
    tone: 'default',
  },
})
