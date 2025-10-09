import type { Component, JSX } from 'solid-js'

type CheckboxInputProps = {
  checked: boolean
  // TODO: it is instead of onChange: (e: Event) => void, also possible on other places?
  onChange: JSX.EventHandlerUnion<HTMLInputElement, Event>
  onMouseDownStopPropagation?: boolean
}

export const CheckboxInput: Component<CheckboxInputProps> = props => (
  <input
    type="checkbox"
    checked={props.checked}
    onMouseDown={props.onMouseDownStopPropagation ? (e) => e.stopPropagation() : undefined}
    onChange={props.onChange}
  />
)