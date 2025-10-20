import { ToastContext } from './toast-context'
import { createToastStore } from './create-toast-store'
import type { ParentComponent } from 'solid-js'

export const ToastProvider: ParentComponent = props => (
  <ToastContext.Provider value={createToastStore()}>{props.children}</ToastContext.Provider>
)