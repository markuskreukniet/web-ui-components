import type { Component } from 'solid-js'

type CheckboxInputProps = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export const CheckboxInput: Component<CheckboxInputProps> = props => (
  <input
    type="checkbox"
    checked={props.checked}
    onChange={e => props.onChange(e.currentTarget.checked)}
  />
)