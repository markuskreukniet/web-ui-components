import { createSignal } from 'solid-js'

// TODO: WIP
// TODO: FileResultInspector.tsx with FileResultTable.tsx has parts that also should be part of a module?
// TODO: naming

const ToastType = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning'
} as const

type ToastType = typeof ToastType[keyof typeof ToastType]

type Toast = {
  id: number,
  message: string,
  toastType: ToastType
}

const [toasts, setToasts] = createSignal<Toast[]>([])

let toastId = 1

export function useToasts() {
  function addToast(message: string, toastType = ToastType.success, timeout = 3000) {
    const id = toastId++
    setToasts(current => [...current, { id, message, toastType }])
    setTimeout(() => removeToast(id), timeout)
  }

  function removeToast(id: number) {
    setToasts(current => current.filter(t => t.id !== id))
  }

  return { toasts, addToast, removeToast }
}
