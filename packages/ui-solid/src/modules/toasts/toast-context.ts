import { createContext, useContext } from 'solid-js'
import { left, right } from '../../monads/either'
import type { ToastStore } from './create-toast-store'
import type { Either } from '../../monads/either'

// ToastContext is a globally accessible SolidJS context object that provides access to the toast store.
// It is named using PascalCase to align with JSX conventions,
// where context objects may be passed to <Provider> components.
export const ToastContext = createContext<ToastStore>()

export function useToastContext(): Either<Error, ToastStore> {
  const context = useContext(ToastContext)
  return context ? right(context) : left(new Error(
    'useToastContext must be used within a <ToastProvider>. Please wrap your component in a <ToastProvider>.'
  ))
}