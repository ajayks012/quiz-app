import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { labelVariants } from './typography.variants'

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {
  required?: boolean
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size, disabled, error, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        aria-disabled={disabled || undefined}
        className={cn(labelVariants({ size, disabled, error }), className)}
        {...props}
      >
        {children}
        {required && (
          <span className="text-rose-500 dark:text-rose-400 font-bold" aria-hidden="true">
            *
          </span>
        )}
      </label>
    )
  },
)

Label.displayName = 'Label'
