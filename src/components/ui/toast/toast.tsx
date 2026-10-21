import * as React from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/utils'
import { useToastStore, type ToastItem } from './toast.store'

const toastIcons = {
  info: <Info className="w-5 h-5 text-sky-500 shrink-0" aria-hidden="true" />,
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" aria-hidden="true" />,
}

const ToastElement: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const { id, title, message, variant = 'info', duration = 4000 } = toast

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 w-full max-w-sm rounded-xl border bg-white p-4 shadow-xl transition-all duration-200 animate-in slide-in-from-top-4 fade-in',
        'dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-50',
      )}
    >
      {toastIcons[variant]}
      <div className="flex-1 min-w-0">
        {title && <h5 className="font-semibold text-sm leading-tight mb-0.5">{title}</h5>}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">{message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export const Toaster: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((item) => (
        <div key={item.id} className="pointer-events-auto">
          <ToastElement toast={item} onDismiss={removeToast} />
        </div>
      ))}
    </div>
  )
}

Toaster.displayName = 'Toaster'
