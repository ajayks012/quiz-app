import * as React from 'react'
import { cn } from '@/utils'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  placement?: TooltipPlacement
  delay?: number
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 150,
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId = React.useId()

  const showTooltip = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIsVisible(false)
  }

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const placementClasses: Record<TooltipPlacement, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses: Record<TooltipPlacement, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 border-x-transparent border-b-transparent',
    bottom:
      'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 border-y-transparent border-r-transparent',
    right:
      'right-full top-1/2 -translate-y-1/2 border-r-slate-900 border-y-transparent border-l-transparent',
  }

  const trigger = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>

  const child = React.cloneElement(trigger, {
    'aria-describedby': isVisible ? tooltipId : undefined,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      trigger.props.onMouseEnter?.(e)
      showTooltip()
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      trigger.props.onMouseLeave?.(e)
      hideTooltip()
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      trigger.props.onFocus?.(e)
      showTooltip()
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      trigger.props.onBlur?.(e)
      hideTooltip()
    },
  })

  return (
    <div className="relative inline-flex">
      {child}
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs text-white shadow-md animate-in fade-in zoom-in-95 duration-150 dark:bg-slate-800 dark:border dark:border-slate-700 pointer-events-none',
            placementClasses[placement],
            className,
          )}
        >
          {content}
          <span className={cn('absolute border-4', arrowClasses[placement])} aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

Tooltip.displayName = 'Tooltip'
