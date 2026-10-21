import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { textVariants } from './typography.variants'

export type TextTag = 'p' | 'span' | 'div' | 'strong' | 'em'

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: TextTag
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    { className, size, tone, weight, align, truncate, as: Component = 'p', children, ...props },
    ref,
  ) => {
    return React.createElement(
      Component,
      {
        ref,
        className: cn(textVariants({ size, tone, weight, align, truncate }), className),
        ...props,
      },
      children,
    )
  },
)

Text.displayName = 'Text'
