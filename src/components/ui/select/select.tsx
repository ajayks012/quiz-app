import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/utils'
import { selectTriggerVariants } from './select.variants'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  id?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorText?: string
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  name?: string
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      id,
      options,
      value,
      onChange,
      placeholder = 'Select an option...',
      disabled = false,
      error,
      errorText,
      helperText,
      size = 'md',
      className,
      name,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const generatedId = React.useId()
    const selectId = id ?? generatedId
    const isError = Boolean(error || errorText)

    const selectedOption = options.find((opt) => opt.value === value)

    React.useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
        }
      }
      if (isOpen) {
        document.addEventListener('mousedown', handleOutsideClick)
      }
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick)
      }
    }, [isOpen])

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return
      onChange?.(option.value)
      setIsOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    return (
      <div ref={containerRef} className="relative w-full space-y-1">
        {name && <input type="hidden" name={name} value={value ?? ''} />}
        <button
          id={selectId}
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled || undefined}
          aria-invalid={isError || undefined}
          aria-describedby={
            errorText ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          className={cn(selectTriggerVariants({ size, error: isError }), className)}
        >
          <span className={cn('truncate', !selectedOption && 'text-slate-400 dark:text-slate-500')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2',
              isOpen && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <ul
            role="listbox"
            tabIndex={-1}
            aria-labelledby={selectId}
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
          >
            {options.length === 0 ? (
              <li className="p-2 text-center text-xs text-slate-500 dark:text-slate-400">
                No options available
              </li>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      'relative flex cursor-pointer select-none items-center justify-between rounded-md px-3 py-2 text-sm text-slate-800 transition-colors dark:text-slate-200',
                      isSelected &&
                        'bg-indigo-50 font-medium text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
                      !isSelected &&
                        !option.disabled &&
                        'hover:bg-slate-100 dark:hover:bg-slate-800',
                      option.disabled && 'cursor-not-allowed opacity-40',
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </li>
                )
              })
            )}
          </ul>
        )}

        {errorText && (
          <p
            id={`${selectId}-error`}
            className="text-xs font-medium text-rose-500 dark:text-rose-400"
            role="alert"
          >
            {errorText}
          </p>
        )}
        {!errorText && helperText && (
          <p id={`${selectId}-helper`} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
