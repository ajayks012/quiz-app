import { cva } from 'class-variance-authority'

export const spinnerVariants = cva('animate-spin text-indigo-600 dark:text-indigo-500', {
  variants: {
    size: {
      xs: 'w-3.5 h-3.5',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    },
    color: {
      primary: 'text-indigo-600 dark:text-indigo-400',
      white: 'text-white',
      muted: 'text-slate-400 dark:text-slate-500',
      current: 'text-current',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

export const skeletonVariants = cva('animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800', {
  variants: {
    shape: {
      rectangle: 'rounded-md',
      circle: 'rounded-full',
    },
  },
  defaultVariants: {
    shape: 'rectangle',
  },
})
