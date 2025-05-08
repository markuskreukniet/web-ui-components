import { ToastContext } from './toast-context'
import { createToastStore } from './create-toast-store'
import type { ParentProps } from 'solid-js';

export function ToastProvider(props: Readonly<ParentProps>) {
  return (
    <ToastContext.Provider value={createToastStore()}>
      {props.children}
    </ToastContext.Provider>
  )
}