import { cva } from 'class-variance-authority'
import { focusRing } from '@/styles'

export const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center font-medium select-none cursor-pointer',
    'transition-all duration-200 ease-in-out shrink-0',
    focusRing,
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-600',
        secondary:
          'bg-slate-100 text-slate-800 shadow-xs hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
        outline:
          'border border-slate-300 bg-transparent text-slate-800 shadow-xs hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
        ghost:
          'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800',
        destructive:
          'bg-rose-600 text-white shadow-xs hover:bg-rose-700 active:bg-rose-800 dark:bg-rose-500 dark:hover:bg-rose-600',
        success:
          'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-500 dark:hover:bg-emerald-600',
      },
      size: {
        xs: 'w-7 h-7 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-9 h-9 text-base',
        lg: 'w-10 h-10 text-lg',
      },
      shape: {
        rounded: 'rounded-lg',
        circle: 'rounded-full',
      },
      loading: {
        true: 'cursor-wait relative select-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
      shape: 'rounded',
      loading: false,
    },
  },
)
