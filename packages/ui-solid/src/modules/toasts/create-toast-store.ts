import { createSignal } from 'solid-js'

const ToastVariants = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning'
} as const

type ToastVariant = typeof ToastVariants[keyof typeof ToastVariants]

// TODO: Readonly<props>
// TODO: add function return types
// TODO: is the project naming still correct since there are modules and components
// TODO: some component are modules
// TODO: FileResultInspector.tsx with FileResultTable.tsx has parts that also should be part of a module?
// TODO: CSS rules

type ToastItem = {
  toastId: string
  text: string
  variant: ToastVariant
}

export function createToastStore() {
  const [toastItems, setToastItems] = createSignal<ToastItem[]>([])

  function addToast(text: string, variant: ToastVariant) {
    // Using UUID ensures global uniqueness, avoids ID collisions, and eliminates the need for manual counter logic.
    // It's a robust, built-in, and future-proof solution for transient UI identifiers.
    const toastId = crypto.randomUUID();

    setToastItems(prev => [...prev, { toastId, text, variant }])
    setTimeout(() => removeToast(toastId), 3000)
  }

  function removeToast(id: string) {
    setToastItems(prev => prev.filter(t => t.toastId !== id))
  }

  return { toastItems, addToast, removeToast }
}

export type ToastStore = ReturnType<typeof createToastStore>