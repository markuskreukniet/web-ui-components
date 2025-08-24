import { For } from 'solid-js'
import { TertiaryButton } from '../../components/buttons/TertiaryButton'
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
            <TertiaryButton
              onPress={() => removeToast(item.toastId)}
            >
              × {/* × (U+00D7): correct typographic symbol for close/dismiss actions */}
            </TertiaryButton>
          </div>
        )}
      </For>
    </div>
  )
}