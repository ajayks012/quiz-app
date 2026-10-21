import { cva } from 'class-variance-authority'

export const dialogContentVariants = cva(
  [
    'relative w-full rounded-xl border border-slate-200 bg-white p-6 shadow-2xl transition-all duration-200 max-h-[90vh] overflow-y-auto',
    'dark:border-slate-800 dark:bg-slate-900',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-[95vw] max-h-[95vh]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)
