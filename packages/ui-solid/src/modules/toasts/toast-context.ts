import { createContext, useContext } from 'solid-js'
import type { ToastStore } from './create-toast-store'
import type { Either } from '../monads/either'

// ToastContext is a globally accessible SolidJS context object that provides access to the toast store.
// It is named using PascalCase to align with JSX conventions,
// where context objects may be passed to <Provider> components.
export const ToastContext = createContext<ToastStore>()

export function useToastContext(): ToastStore {
  const context = useContext(ToastContext)
  if (!context) {
    // This error is thrown intentionally to enforce correct usage of the context.
    // An Either is not returned to streamline usage at the call site,
    // as the absence of context indicates a development-time configuration error.
    throw new Error(
      'useToastContext must be used within a <ToastProvider>. Please wrap your component in a <ToastProvider>.'
    )
  }
  return context
}

export function addErrorToastFromEither(either: Either<Error, never>): void {
  useToastContext().addErrorToast(either.value.message)
}