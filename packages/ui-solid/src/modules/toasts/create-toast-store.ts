import { createSignal } from 'solid-js'

const ToastVariants = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning'
} as const

type ToastVariant = typeof ToastVariants[keyof typeof ToastVariants]

type ToastItem = {
  toastId: string
  text: string
  variant: ToastVariant
}

export function createToastStore() {
  const [toastItems, setToastItems] = createSignal<ToastItem[]>([])

  function addSuccessToast(text: string) {
    addToast(text, ToastVariants.success, false)
  }

  function addErrorToast(text: string) {
    addToast(text, ToastVariants.error, true)
  }

  function addToast(text: string, variant: ToastVariant, persistent: boolean) {
    // Using UUID ensures global uniqueness, avoids ID collisions, and eliminates the need for manual counter logic.
    // It's a robust, built-in, and future-proof solution for transient UI identifiers.
    const toastId = crypto.randomUUID()

    setToastItems(prev => [...prev, { toastId, text, variant }])

    if (!persistent) {
      setTimeout(() => removeToast(toastId), 3000)
    }
  }

  function removeToast(id: string) {
    setToastItems(prev => prev.filter(t => t.toastId !== id))
  }

  return { addErrorToast, addSuccessToast, addToast, removeToast, toastItems }
}

export type ToastStore = ReturnType<typeof createToastStore>