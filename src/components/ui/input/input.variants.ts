import { cva } from 'class-variance-authority'
import { focusRing } from '@/styles'

export const inputVariants = cva(
  [
    'w-full rounded-lg border bg-white text-slate-900 transition-colors duration-150',
    'placeholder:text-slate-400 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500',
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

export const textareaVariants = cva(
  [
    'w-full rounded-lg border bg-white p-3 text-slate-900 transition-colors duration-150',
    'placeholder:text-slate-400 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500',
    focusRing,
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-900',
  ].join(' '),
  {
    variants: {
      error: {
        true: 'border-rose-500 focus-visible:ring-rose-500 dark:border-rose-500',
        false: 'border-slate-300 dark:border-slate-700',
      },
    },
    defaultVariants: {
      error: false,
    },
  },
)
