import { For } from 'solid-js'
import { useToastContext } from './toast-context'
import type { Component } from 'solid-js'

export const ToastContainer: Component = () => {
  const { toastItems } = useToastContext()

  return (
    <div class="toast-container">
      <For each={toastItems()}>
        {item => (
          <div class={`toast-item toast-item--${item.variant}`}>
            {item.text}
          </div>
        )}
      </For>
    </div>
  )
}