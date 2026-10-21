import * as React from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { cn } from '@/utils'
import { focusRing } from '@/styles'
import type { SelectOption } from './select'

export interface MultiSelectProps {
  id?: string
  options: SelectOption[]
  values?: string[]
  onChange?: (values: string[]) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorText?: string
  helperText?: string
  className?: string
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      id,
      options,
      values = [],
      onChange,
      placeholder = 'Select items...',
      disabled = false,
      error,
      errorText,
      helperText,
      className,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')
    const containerRef = React.useRef<HTMLDivElement>(null)
    const generatedId = React.useId()
    const selectId = id ?? generatedId
    const isError = Boolean(error || errorText)

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

    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const toggleOption = (value: string) => {
      if (disabled) return
      if (values.includes(value)) {
        onChange?.(values.filter((v) => v !== value))
      } else {
        onChange?.([...values, value])
      }
    }

    const removeValue = (value: string, e: React.MouseEvent) => {
      e.stopPropagation()
      if (disabled) return
      onChange?.(values.filter((v) => v !== value))
    }

    const clearAll = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (disabled) return
      onChange?.([])
    }

    return (
      <div ref={containerRef} className="relative w-full space-y-1">
        <div
          ref={ref}
          id={selectId}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled || undefined}
          aria-invalid={isError || undefined}
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!disabled) setIsOpen((prev) => !prev)
            } else if (e.key === 'Escape') {
              setIsOpen(false)
            }
          }}
          className={cn(
            'flex min-h-9 w-full flex-wrap items-center justify-between gap-1.5 rounded-lg border bg-white p-1.5 text-sm transition-colors duration-150 cursor-pointer',
            'dark:bg-slate-950 dark:text-slate-50',
            focusRing,
            isError
              ? 'border-rose-500 focus-visible:ring-rose-500 dark:border-rose-500'
              : 'border-slate-300 dark:border-slate-700',
            disabled &&
              'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 pointer-events-none',
            className,
          )}
        >
          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
            {values.length === 0 ? (
              <span className="text-slate-400 dark:text-slate-500 px-1.5">{placeholder}</span>
            ) : (
              values.map((val) => {
                const option = options.find((opt) => opt.value === val)
                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
                  >
                    <span>{option ? option.label : val}</span>
                    <button
                      type="button"
                      onClick={(e) => removeValue(val, e)}
                      className="rounded-full p-0.5 hover:bg-indigo-200/60 dark:hover:bg-indigo-900 transition-colors"
                      aria-label={`Remove ${option ? option.label : val}`}
                    >
                      <X className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </span>
                )
              })
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 px-1">
            {values.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
                aria-label="Clear all selections"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
            <ChevronDown
              className={cn(
                'w-4 h-4 text-slate-400 transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 flex flex-col">
            <div className="relative mb-1 px-1">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-md bg-slate-50 dark:bg-slate-800 pl-8 pr-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <ul
              role="listbox"
              aria-multiselectable="true"
              className="overflow-auto flex-1 max-h-48"
            >
              {filteredOptions.length === 0 ? (
                <li className="p-3 text-center text-xs text-slate-500 dark:text-slate-400">
                  No matching options
                </li>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = values.includes(option.value)
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => toggleOption(option.value)}
                      className={cn(
                        'flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-slate-800 dark:text-slate-200 transition-colors',
                        isSelected &&
                          'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
                        !isSelected && 'hover:bg-slate-100 dark:hover:bg-slate-800',
                      )}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </li>
                  )
                })
              )}
            </ul>
          </div>
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

MultiSelect.displayName = 'MultiSelect'
