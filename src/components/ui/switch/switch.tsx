import * as React from 'react'
import { cn } from '@/utils'
import { switchThumbVariants, switchTrackVariants } from './switch.variants'

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  label?: React.ReactNode
  description?: string
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      size = 'md',
      disabled = false,
      label,
      description,
      id,
      className,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const switchId = id ?? generatedId

    const [uncontrolledChecked, setUncontrolledChecked] = React.useState<boolean>(defaultChecked)
    const isControlled = controlledChecked !== undefined
    const isChecked = isControlled ? controlledChecked : uncontrolledChecked

    const toggle = () => {
      if (disabled) return
      const nextChecked = !isChecked
      if (!isControlled) {
        setUncontrolledChecked(nextChecked)
      }
      onCheckedChange?.(nextChecked)
    }

    return (
      <div
        className={cn(
          'inline-flex items-start gap-3 cursor-pointer select-none',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        onClick={toggle}
      >
        <button
          id={switchId}
          ref={ref}
          type="button"
          role="switch"
          aria-checked={isChecked}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            toggle()
          }}
          className={cn(switchTrackVariants({ size, checked: isChecked }))}
          {...props}
        >
          <span className={cn(switchThumbVariants({ size, checked: isChecked }))} />
        </button>

        {(label || description) && (
          <label htmlFor={switchId} className="flex flex-col text-sm leading-tight cursor-pointer">
            {label && (
              <span className="font-medium text-slate-800 dark:text-slate-200">{label}</span>
            )}
            {description && (
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    )
  },
)

Switch.displayName = 'Switch'
