import { For } from 'solid-js'
import { Button, ButtonVariants } from '../../components/buttons/Button'
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
            <Button
              content="×" // × (U+00D7): correct typographic symbol for close/dismiss actions
              variant={ButtonVariants.tertiary}
              onPress={() => removeToast(item.toastId)}
            />
          </div>
        )}
      </For>
    </div>
  )
}