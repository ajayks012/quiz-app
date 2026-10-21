import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { headingVariants } from './typography.variants'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingTag = HeadingLevel | 'span' | 'div'

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: HeadingTag
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 'h1', align, as, children, ...props }, ref) => {
    const Component = as ?? (level === 'display' ? 'h1' : (level as HeadingLevel))

    return (
      <Component ref={ref} className={cn(headingVariants({ level, align }), className)} {...props}>
        {children}
      </Component>
    )
  },
)

Heading.displayName = 'Heading'
