import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { inputVariants } from './input.variants'

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  helperText?: string
  errorText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = 'md',
      error,
      leftIcon,
      rightIcon,
      helperText,
      errorText,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const isError = Boolean(error || errorText)

    return (
      <div className="w-full space-y-1">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={isError || undefined}
            aria-describedby={
              errorText ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              inputVariants({ size, error: isError }),
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-slate-400">{rightIcon}</div>
          )}
        </div>
        {errorText && (
          <p
            id={`${inputId}-error`}
            className="text-xs font-medium text-rose-500 dark:text-rose-400"
            role="alert"
          >
            {errorText}
          </p>
        )}
        {!errorText && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
