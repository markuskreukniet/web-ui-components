import { For } from 'solid-js'
import { CloseButton } from '../../components/buttons/iconButtons/CloseButton'
import { useToastContext } from './toast-context'
import type { Component } from 'solid-js'

export const ToastContainer: Component = () => {
  const { removeToast, toastItems } = useToastContext()

  return (
    <div class="toast-container">
      <For each={toastItems()}>
        {item => (
          <div class={`toast-item toast-item--${item.variant}`}>
            <span>{item.text}</span>
            <CloseButton onPress={() => removeToast(item.toastId)} />
          </div>
        )}
      </For>
    </div>
  )
}