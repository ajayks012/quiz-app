import { create } from 'zustand'
import { uniqueId } from '@/utils'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
  id: string
  title?: string
  message: string
  variant?: ToastVariant
  duration?: number
}

interface ToastStore {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = uniqueId('toast')
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
    return id
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearAll: () => set({ toasts: [] }),
}))

export const toast = {
  show: (
    message: string,
    options?: { title?: string; variant?: ToastVariant; duration?: number },
  ) => {
    return useToastStore.getState().addToast({
      message,
      title: options?.title,
      variant: options?.variant ?? 'info',
      duration: options?.duration ?? 4000,
    })
  },
  success: (message: string, title?: string) => {
    return toast.show(message, { title, variant: 'success' })
  },
  error: (message: string, title?: string) => {
    return toast.show(message, { title, variant: 'error' })
  },
  info: (message: string, title?: string) => {
    return toast.show(message, { title, variant: 'info' })
  },
  warning: (message: string, title?: string) => {
    return toast.show(message, { title, variant: 'warning' })
  },
  dismiss: (id: string) => {
    useToastStore.getState().removeToast(id)
  },
}
