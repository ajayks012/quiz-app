import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils'
import { buttonVariants } from './button.variants'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      iconOnly = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = 'button',
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
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size, iconOnly, loading }), className)}
        {...props}
      >
        {loading && (
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center pointer-events-none',
              spinnerColor,
            )}
          >
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          </span>
        )}
        {!loading && leftIcon && (
          <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span
          className={cn(
            'inline-flex items-center justify-center gap-2 flex-wrap text-center max-w-full leading-tight [&_svg]:shrink-0',
            loading && 'invisible',
          )}
        >
          {children}
        </span>
        {!loading && rightIcon && (
          <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
