import { cva } from 'class-variance-authority'

export const alertVariants = cva(
  'relative w-full rounded-xl border p-4 text-sm transition-all duration-200 flex items-start gap-3.5',
  {
    variants: {
      variant: {
        info: 'bg-sky-50/80 border-sky-200 text-sky-950 dark:bg-sky-950/40 dark:border-sky-800 dark:text-sky-200',
        success:
          'bg-emerald-50/80 border-emerald-200 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200',
        warning:
          'bg-amber-50/80 border-amber-200 text-amber-950 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200',
        error:
          'bg-rose-50/80 border-rose-200 text-rose-950 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
)
