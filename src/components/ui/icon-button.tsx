import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils'
import { iconButtonVariants } from './icon-button.variants'

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconButtonVariants> {
  'aria-label': string
  loading?: boolean
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      shape = 'rounded',
      loading = false,
      disabled,
      children,
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    const spinnerColor =
      variant === 'secondary' || variant === 'outline' || variant === 'ghost'
        ? 'text-slate-800 dark:text-slate-200'
        : 'text-white'

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        className={cn(iconButtonVariants({ variant, size, shape, loading }), className)}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn('w-4 h-4 animate-spin', spinnerColor)} aria-hidden="true" />
        ) : (
          children
        )}
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'
