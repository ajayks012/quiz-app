import * as React from 'react'
import { cn } from '@/utils'
import { radioItemVariants } from './radio-group.variants'

interface RadioGroupContextValue {
  name: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: boolean
  errorText?: string
  size?: 'sm' | 'md' | 'lg'
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name: customName,
      value: controlledValue,
      defaultValue,
      onChange,
      disabled = false,
      error = false,
      errorText,
      size = 'md',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedName = React.useId()
    const name = customName ?? generatedName

    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(
      defaultValue,
    )
    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : uncontrolledValue

    const handleChange = (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onChange?.(newValue)
    }

    const isError = Boolean(error || errorText)

    return (
      <RadioGroupContext.Provider
        value={{
          name,
          value: currentValue,
          onChange: handleChange,
          disabled,
          size,
          error: isError,
        }}
      >
        <div
          ref={ref}
          role="radiogroup"
          aria-invalid={isError || undefined}
          className={cn('space-y-2', className)}
          {...props}
        >
          {children}
          {errorText && (
            <p className="text-xs font-medium text-rose-500 dark:text-rose-400" role="alert">
              {errorText}
            </p>
          )}
        </div>
      </RadioGroupContext.Provider>
    )
  },
)

RadioGroup.displayName = 'RadioGroup'

export interface RadioGroupItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  label?: React.ReactNode
  description?: string
  disabled?: boolean
  id?: string
}

export const RadioGroupItem = React.forwardRef<HTMLDivElement, RadioGroupItemProps>(
  ({ value, label, description, disabled = false, id, className, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext)
    const generatedId = React.useId()
    const itemId = id ?? generatedId

    if (!context) {
      throw new Error('RadioGroupItem must be used within a RadioGroup')
    }

    const isSelected = context.value === value
    const isDisabled = context.disabled || disabled
    const size = context.size ?? 'md'

    const dotSizes = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
    }

    const handleSelect = () => {
      if (!isDisabled) {
        context.onChange?.(value)
      }
    }

    return (
      <div
        ref={ref}
        onClick={handleSelect}
        className={cn(
          'inline-flex items-start gap-2.5 cursor-pointer select-none',
          isDisabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        {...props}
      >
        <div className="relative flex items-center pt-0.5">
          <input
            id={itemId}
            type="radio"
            name={context.name}
            value={value}
            checked={isSelected}
            disabled={isDisabled}
            onChange={() => handleSelect()}
            className="sr-only"
          />
          <div
            aria-hidden="true"
            className={cn(
              radioItemVariants({
                size,
                selected: isSelected,
                error: context.error,
              }),
            )}
          >
            {isSelected && (
              <span
                className={cn(
                  'rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-150',
                  dotSizes[size],
                )}
              />
            )}
          </div>
        </div>

        {(label || description) && (
          <label htmlFor={itemId} className="flex flex-col text-sm leading-tight cursor-pointer">
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

RadioGroupItem.displayName = 'RadioGroupItem'
