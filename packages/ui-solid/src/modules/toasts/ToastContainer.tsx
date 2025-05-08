import { For } from 'solid-js'
import { isLeft } from '../../monads/either'
import { useToastContext } from './toast-context'

export function ToastContainer() {
  const result = useToastContext()

  if (isLeft(result)) {
    console.error(result.value)
    return null
  }

  const { toastItems } = result.value

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