import { createSignal } from 'solid-js'

const ToastVariants = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning'
} as const

type ToastVariant = typeof ToastVariants[keyof typeof ToastVariants]

// TODO: add function return types
// TODO: is the project naming still correct since there are modules and components
// TODO: some component are modules
// TODO: FileResultInspector.tsx with FileResultTable.tsx has parts that also should be part of a module?
// TODO: CSS rules
// : naming convention such type DuplicateScanResultEither = Either<Error, DuplicateScanResult> and naming a function type same as function but with starting capital letter.
// handler naming. Onchange naming. selected, show, previous, current, next, update woordjes.
// TODO: check naming in all files
// TODO: make UI core project

// TODO: add function close toast for closing persistent toasts

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
    const toastId = crypto.randomUUID();

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