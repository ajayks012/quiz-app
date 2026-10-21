import { cva } from 'class-variance-authority'
import { focusRing } from '@/styles'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center font-medium rounded-lg select-none whitespace-nowrap',
    'transition-all duration-200 ease-in-out cursor-pointer',
    focusRing,
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-600',
        secondary:
          'bg-slate-100 text-slate-900 shadow-xs hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
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
        xs: 'h-7 px-2.5 text-xs gap-1.5',
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-9 px-4 text-sm gap-2',
        lg: 'h-10 px-5 text-base gap-2.5',
      },
      iconOnly: {
        true: 'p-0',
        false: '',
      },
      loading: {
        true: 'cursor-wait relative select-none',
        false: '',
      },
    },
    compoundVariants: [
      {
        size: 'xs',
        iconOnly: true,
        className: 'w-7 h-7 px-0',
      },
      {
        size: 'sm',
        iconOnly: true,
        className: 'w-8 h-8 px-0',
      },
      {
        size: 'md',
        iconOnly: true,
        className: 'w-9 h-9 px-0',
      },
      {
        size: 'lg',
        iconOnly: true,
        className: 'w-10 h-10 px-0',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      iconOnly: false,
      loading: false,
    },
  },
)
