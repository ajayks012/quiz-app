import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { badgeVariants } from './badge.variants'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean
  icon?: React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, icon, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
        {dot && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-80"
            aria-hidden="true"
          />
        )}
        {icon && (
          <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </span>
    )
  },
)

Badge.displayName = 'Badge'
