import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { textareaVariants } from './input.variants'

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {
  helperText?: string
  errorText?: string
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, helperText, errorText, id, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const isError = Boolean(error || errorText)

    return (
      <div className="w-full space-y-1">
        <textarea
          id={inputId}
          ref={ref}
          disabled={disabled}
          aria-invalid={isError || undefined}
          aria-describedby={
            errorText ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={cn(textareaVariants({ error: isError }), className)}
          {...props}
        />
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

TextArea.displayName = 'TextArea'
