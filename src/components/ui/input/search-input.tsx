import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/utils'
import { Input, type InputProps } from './input'

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, disabled, ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0)

    const handleClear = () => {
      if (onClear) {
        onClear()
      } else if (onChange) {
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
    }

    return (
      <Input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        disabled={disabled}
        leftIcon={<Search className="w-4 h-4 text-slate-400" aria-hidden="true" />}
        rightIcon={
          hasValue && !disabled ? (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          ) : undefined
        }
        className={cn('[&::-webkit-search-cancel-button]:hidden', className)}
        {...props}
      />
    )
  },
)

SearchInput.displayName = 'SearchInput'
