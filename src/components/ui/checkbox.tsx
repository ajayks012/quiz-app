import * as React from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/utils'
import { checkboxVariants } from './checkbox.variants'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  indeterminate?: boolean
  label?: React.ReactNode
  description?: string
  error?: boolean
  errorText?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      size = 'md',
      indeterminate = false,
      checked,
      disabled,
      label,
      description,
      error,
      errorText,
      id,
      onChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const checkboxId = id ?? generatedId
    const isError = Boolean(error || errorText)
    const isChecked = Boolean(checked)

    const inputRef = React.useRef<HTMLInputElement | null>(null)

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate
      }
    }, [indeterminate])

    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    }

    return (
      <div className="flex flex-col space-y-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            'inline-flex items-start gap-2.5 cursor-pointer select-none',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <div className="relative flex items-center pt-0.5">
            <input
              id={checkboxId}
              ref={(node) => {
                inputRef.current = node
                if (typeof ref === 'function') {
                  ref(node)
                } else if (ref) {
                  ref.current = node
                }
              }}
              type="checkbox"
              checked={isChecked}
              disabled={disabled}
              readOnly={!onChange}
              onChange={onChange}
              aria-invalid={isError || undefined}
              className="sr-only"
              {...props}
            />
            <div
              className={cn(
                checkboxVariants({
                  size,
                  checked: isChecked || indeterminate,
                  error: isError,
                }),
                className,
              )}
            >
              {indeterminate ? (
                <Minus className={cn(iconSizes[size], 'stroke-[3]')} aria-hidden="true" />
              ) : isChecked ? (
                <Check className={cn(iconSizes[size], 'stroke-[3]')} aria-hidden="true" />
              ) : null}
            </div>
          </div>
          {(label || description) && (
            <div className="flex flex-col text-sm leading-tight">
              {label && (
                <span className="font-medium text-slate-800 dark:text-slate-200">{label}</span>
              )}
              {description && (
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {description}
                </span>
              )}
            </div>
          )}
        </label>
        {errorText && (
          <p className="text-xs font-medium text-rose-500 dark:text-rose-400" role="alert">
            {errorText}
          </p>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
