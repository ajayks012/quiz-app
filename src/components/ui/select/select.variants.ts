import { cva } from 'class-variance-authority'
import { focusRing } from '@/styles'

export const selectTriggerVariants = cva(
  [
    'flex w-full items-center justify-between rounded-lg border bg-white text-slate-900 transition-colors duration-150',
    'dark:bg-slate-950 dark:text-slate-50 text-left cursor-pointer',
    focusRing,
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-900',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
      },
      error: {
        true: 'border-rose-500 focus-visible:ring-rose-500 dark:border-rose-500',
        false: 'border-slate-300 dark:border-slate-700',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  },
)
