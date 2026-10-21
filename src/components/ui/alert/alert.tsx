import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/utils'
import { alertVariants } from './alert.variants'

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alertVariants> {
  title?: React.ReactNode
  icon?: React.ReactNode
  onClose?: () => void
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, icon, onClose, children, ...props }, ref) => {
    const defaultIcons = {
      info: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" aria-hidden="true" />,
      success: (
        <CheckCircle2
          className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0"
          aria-hidden="true"
        />
      ),
      warning: (
        <AlertTriangle
          className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0"
          aria-hidden="true"
        />
      ),
      error: (
        <AlertCircle
          className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0"
          aria-hidden="true"
        />
      ),
    }

    const renderIcon = icon ?? (variant ? defaultIcons[variant] : defaultIcons.info)

    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
        {renderIcon}
        <div className="flex-1 space-y-1 min-w-0">
          {title && <h5 className="font-semibold leading-tight">{title}</h5>}
          {children && (
            <div className="text-xs sm:text-sm opacity-90 leading-normal">{children}</div>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    )
  },
)

Alert.displayName = 'Alert'
