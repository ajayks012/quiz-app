import { cva } from 'class-variance-authority'
import { focusRing } from '@/styles'

export const radioItemVariants = cva(
  [
    'peer shrink-0 rounded-full border transition-all duration-150 flex items-center justify-center cursor-pointer',
    focusRing,
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
      },
      selected: {
        true: 'border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-950',
        false: 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950',
      },
      error: {
        true: 'border-rose-500 dark:border-rose-500',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      selected: false,
      error: false,
    },
  },
)
