import { cva } from 'class-variance-authority'
import { focusRing } from '@/styles'

export const switchTrackVariants = cva(
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out',
    focusRing,
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-4 w-7 p-0.5',
        md: 'h-5 w-9 p-0.5',
        lg: 'h-6 w-11 p-0.5',
      },
      checked: {
        true: 'bg-indigo-600 dark:bg-indigo-500',
        false: 'bg-slate-300 dark:bg-slate-700',
      },
    },
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  },
)

export const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
      checked: {
        true: '',
        false: 'translate-x-0',
      },
    },
    compoundVariants: [
      {
        size: 'sm',
        checked: true,
        className: 'translate-x-3',
      },
      {
        size: 'md',
        checked: true,
        className: 'translate-x-4',
      },
      {
        size: 'lg',
        checked: true,
        className: 'translate-x-5',
      },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  },
)
