import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { captionVariants } from './typography.variants'

export type CaptionTag = 'p' | 'span' | 'div'

export interface CaptionProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof captionVariants> {
  as?: CaptionTag
}

export const Caption = React.forwardRef<HTMLElement, CaptionProps>(
  ({ className, size, tone, as: Component = 'p', children, ...props }, ref) => {
    return React.createElement(
      Component,
      {
        ref,
        className: cn(captionVariants({ size, tone }), className),
        ...props,
      },
      children,
    )
  },
)

Caption.displayName = 'Caption'
