import * as React from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/utils'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon = <Inbox className="w-10 h-10 text-slate-400 dark:text-slate-500" aria-hidden="true" />,
      title,
      description,
      action,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30',
          className,
        )}
        {...props}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/80 mb-4">
          {icon}
        </div>
        <h3 className="font-display text-base font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </h3>
        {description && (
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            {description}
          </p>
        )}
        {action && <div className="mt-5">{action}</div>}
      </div>
    )
  },
)

EmptyState.displayName = 'EmptyState'
