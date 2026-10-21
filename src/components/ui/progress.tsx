import * as React from 'react'
import { cn, percentage } from '@/utils'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'danger'
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    { value, max = 100, showValue = false, size = 'md', variant = 'primary', className, ...props },
    ref,
  ) => {
    const clampedValue = Math.min(Math.max(0, value), max)
    const pct = percentage(clampedValue, max, 0)

    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    }

    const variantClasses = {
      primary: 'bg-indigo-600 dark:bg-indigo-500',
      success: 'bg-emerald-600 dark:bg-emerald-500',
      warning: 'bg-amber-500 dark:bg-amber-500',
      danger: 'bg-rose-600 dark:bg-rose-500',
    }

    return (
      <div className="w-full space-y-1.5">
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(
            'w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800',
            sizeClasses[size],
            className,
          )}
          {...props}
        >
          <div
            className={cn('h-full transition-all duration-300 ease-out', variantClasses[variant])}
            style={{ width: `${pct}%` }}
          />
        </div>
        {showValue && (
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
        )}
      </div>
    )
  },
)
ProgressBar.displayName = 'ProgressBar'

export interface CircularProgressProps extends React.SVGAttributes<SVGSVGElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  children?: React.ReactNode
}

export const CircularProgress = React.forwardRef<SVGSVGElement, CircularProgressProps>(
  (
    {
      value,
      max = 100,
      size = 64,
      strokeWidth = 6,
      showValue = true,
      variant = 'primary',
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const clampedValue = Math.min(Math.max(0, value), max)
    const pct = percentage(clampedValue, max, 0)

    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (pct / 100) * circumference

    const variantColors = {
      primary: 'text-indigo-600 dark:text-indigo-500',
      success: 'text-emerald-600 dark:text-emerald-400',
      warning: 'text-amber-500 dark:text-amber-400',
      danger: 'text-rose-600 dark:text-rose-400',
    }

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={cn('rotate-[-90deg]', className)}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          {...props}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-slate-200 dark:stroke-slate-800 fill-none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(
              'stroke-current fill-none transition-all duration-300 ease-out',
              variantColors[variant],
            )}
          />
        </svg>
        {children ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            {children}
          </div>
        ) : showValue ? (
          <span className="absolute text-xs font-semibold text-slate-800 dark:text-slate-200">
            {pct}%
          </span>
        ) : null}
      </div>
    )
  },
)
CircularProgress.displayName = 'CircularProgress'
