import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../dialog'
import { Button } from '../button'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'destructive' | 'primary'
  loading?: boolean
  onConfirm: () => void | Promise<void>
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
  loading = false,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true)
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = loading || isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>
          <Button type="button" variant={variant} loading={isLoading} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

ConfirmDialog.displayName = 'ConfirmDialog'
