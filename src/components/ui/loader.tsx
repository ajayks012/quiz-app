import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils'
import { skeletonVariants, spinnerVariants } from './loader.variants'

export interface SpinnerProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'color'>, VariantProps<typeof spinnerVariants> {
  label?: string
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = 'md', color = 'primary', label = 'Loading...', ...props }, ref) => {
    return (
      <span className="inline-flex items-center justify-center">
        <Loader2
          ref={ref}
          role="status"
          aria-label={label}
          className={cn(spinnerVariants({ size, color }), className)}
          {...props}
        />
        <span className="sr-only">{label}</span>
      </span>
    )
  },
)
Spinner.displayName = 'Spinner'

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shape = 'rectangle', ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(skeletonVariants({ shape }), className)}
        {...props}
      />
    )
  },
)
Skeleton.displayName = 'Skeleton'

export interface PageLoaderProps {
  message?: string
  fullScreen?: boolean
  className?: string
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading...',
  fullScreen = false,
  className,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-8 text-center',
        fullScreen
          ? 'fixed inset-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xs'
          : 'py-16',
        className,
      )}
    >
      <Spinner size="lg" label={message} />
      {message && (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{message}</p>
      )}
    </div>
  )
}
PageLoader.displayName = 'PageLoader'
