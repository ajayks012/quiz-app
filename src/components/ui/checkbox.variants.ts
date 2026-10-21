import { cva } from 'class-variance-authority'
import { focusRing } from '@/styles'

export const checkboxVariants = cva(
  [
    'peer shrink-0 rounded-md border transition-all duration-150 flex items-center justify-center cursor-pointer',
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
      checked: {
        true: 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500',
        false: 'bg-white border-slate-300 dark:bg-slate-950 dark:border-slate-700 text-transparent',
      },
      error: {
        true: 'border-rose-500 dark:border-rose-500',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      checked: false,
      error: false,
    },
  },
)
