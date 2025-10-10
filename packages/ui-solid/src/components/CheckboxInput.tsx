import type { Component } from 'solid-js'

type CheckboxInputProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  onMouseDownStopPropagation?: boolean
}

export const CheckboxInput: Component<CheckboxInputProps> = props => (
  <input
    type="checkbox"
    checked={props.checked}
    onMouseDown={props.onMouseDownStopPropagation ? (e) => e.stopPropagation() : undefined}
    onChange={e => props.onChange(e.currentTarget.checked)}
  />
)