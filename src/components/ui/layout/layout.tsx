import * as React from 'react'
import { cn } from '@/utils'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', ...props }, ref) => {
    const sizeClasses = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      full: 'max-w-full',
    }

    return (
      <div
        ref={ref}
        className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}
        {...props}
      />
    )
  },
)
Container.displayName = 'Container'

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
  wrap?: boolean
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = 'col',
      gap = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      ...props
    },
    ref,
  ) => {
    const gapClasses = {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    }

    const alignClasses = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    }

    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'row' ? 'flex-row' : 'flex-col',
          gapClasses[gap],
          alignClasses[align],
          justifyClasses[justify],
          wrap && 'flex-wrap',
          className,
        )}
        {...props}
      />
    )
  },
)
Stack.displayName = 'Stack'

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 3, gap = 'md', ...props }, ref) => {
    const colClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-12',
    }

    const gapClasses = {
      none: 'gap-0',
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-10',
    }

    return (
      <div
        ref={ref}
        className={cn('grid w-full', colClasses[cols], gapClasses[gap], className)}
        {...props}
      />
    )
  },
)
Grid.displayName = 'Grid'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = 'md', ...props }, ref) => {
    const spacingClasses = {
      sm: 'py-6 sm:py-8',
      md: 'py-10 sm:py-16',
      lg: 'py-16 sm:py-24',
      xl: 'py-20 sm:py-32',
    }

    return (
      <section ref={ref} className={cn('w-full', spacingClasses[spacing], className)} {...props} />
    )
  },
)
Section.displayName = 'Section'
