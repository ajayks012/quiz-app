import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils'
import { dialogContentVariants } from './dialog.variants'

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  titleId: string
  descriptionId: string
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

export interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export const Dialog: React.FC<DialogProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const titleId = React.useId()
  const descriptionId = React.useId()

  return (
    <DialogContext.Provider value={{ open, setOpen, titleId, descriptionId }}>
      {children}
    </DialogContext.Provider>
  )
}

export interface DialogTriggerProps {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>
  asChild?: boolean
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children }) => {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error('DialogTrigger must be used within Dialog')

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e)
      context.setOpen(true)
    },
  })
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  hideCloseButton?: boolean
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, size = 'md', hideCloseButton = false, children, ...props }, ref) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error('DialogContent must be used within Dialog')

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && context.open) {
          context.setOpen(false)
        }
      }
      if (context.open) {
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', handleKeyDown)
      }
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    }, [context])

    if (!context.open) return null

    const dialogContent = (
      <div className="fixed inset-0 z-50 overflow-y-auto" role="presentation">
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          onClick={() => context.setOpen(false)}
          aria-hidden="true"
        />

        <div className="flex min-h-full items-center justify-center p-3 sm:p-4 md:p-6 text-center">
          <div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={context.titleId}
            aria-describedby={context.descriptionId}
            className={cn(
              dialogContentVariants({ size }),
              'relative z-10 w-full text-left transition-all duration-200 animate-in fade-in zoom-in-95',
              className,
            )}
            {...props}
          >
            {!hideCloseButton && (
              <button
                type="button"
                onClick={() => context.setOpen(false)}
                className="absolute right-4 top-4 z-20 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            {children}
          </div>
        </div>
      </div>
    )

    return typeof document !== 'undefined'
      ? createPortal(dialogContent, document.body)
      : dialogContent
  },
)

DialogContent.displayName = 'DialogContent'

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return <div className={cn('flex flex-col space-y-1.5 mb-4 text-left', className)} {...props} />
}

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  return (
    <h2
      ref={ref}
      id={context?.titleId}
      className={cn(
        'font-display text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-50',
        className,
      )}
      {...props}
    />
  )
})
DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  return (
    <p
      ref={ref}
      id={context?.descriptionId}
      className={cn('text-sm text-slate-500 dark:text-slate-400 mt-1', className)}
      {...props}
    />
  )
})
DialogDescription.displayName = 'DialogDescription'

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6 pt-2 border-t border-slate-100 dark:border-slate-800/80',
        className,
      )}
      {...props}
    />
  )
}

export const DialogClose: React.FC<{
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>
}> = ({ children }) => {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error('DialogClose must be used within Dialog')

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e)
      context.setOpen(false)
    },
  })
}
