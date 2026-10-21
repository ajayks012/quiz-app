import * as React from 'react'
import {
  Controller,
  FormProvider,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { cn } from '@/utils'
import { Label } from './label'

export const Form = FormProvider

import {
  FormFieldContext,
  FormItemContext,
  useFormField,
  type FormFieldContextValue,
  type FormItemContextValue,
} from './form.context'

export type { FormFieldContextValue, FormItemContextValue }

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-1.5', className)} {...props} />
      </FormItemContext.Provider>
    )
  },
)
FormItem.displayName = 'FormItem'

export const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, error, ...props }, ref) => {
  const { error: fieldError, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      htmlFor={formItemId}
      error={Boolean(error || fieldError)}
      className={className}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

export const FormControl = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { children: React.ReactElement }
>(({ children, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return React.cloneElement(
    children as React.ReactElement<
      React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
    >,
    {
      ref,
      id: formItemId,
      'aria-describedby': error ? `${formDescriptionId} ${formMessageId}` : `${formDescriptionId}`,
      'aria-invalid': error ? true : undefined,
      ...props,
    },
  )
})
FormControl.displayName = 'FormControl'

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-xs text-slate-500 dark:text-slate-400', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) return null

  return (
    <p
      ref={ref}
      id={formMessageId}
      role="alert"
      className={cn('text-xs font-medium text-rose-500 dark:text-rose-400', className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'
