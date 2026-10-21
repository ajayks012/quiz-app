import { cva } from 'class-variance-authority'

export const cardVariants = cva(
  'rounded-xl border bg-white text-slate-900 transition-all duration-200 dark:bg-slate-900 dark:text-slate-50',
  {
    variants: {
      variant: {
        default: 'border-slate-200/80 shadow-xs dark:border-slate-800',
        elevated: 'border-slate-200/60 shadow-md dark:border-slate-800',
        interactive:
          'border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 cursor-pointer',
        ghost: 'border-transparent shadow-none bg-transparent',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'none',
    },
  },
)
