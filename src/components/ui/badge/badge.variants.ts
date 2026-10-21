import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center font-medium rounded-full transition-colors select-none whitespace-nowrap',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50',
        secondary:
          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
        success:
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50',
        warning:
          'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50',
        danger:
          'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50',
        info: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50',
        outline:
          'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300 bg-transparent',
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px] gap-1',
        md: 'px-2.5 py-0.5 text-xs gap-1.5',
        lg: 'px-3 py-1 text-sm gap-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)
