import { For } from 'solid-js'
import type { Component } from 'solid-js'

type SegmentedControlOption = {
  label: string
  value: string
  disabled: boolean
}

type SegmentedControlProps = {
  name: string
  legend: string
  options: SegmentedControlOption[]
  selected: string
  onChange: (value: string) => void
}

export const SegmentedControl: Component<SegmentedControlProps> = (props) => {
  if (props.options.length > 3) {
    return null
  }

  return (
    <fieldset class="segmented-control">
      <legend class="visually-hidden">{props.legend}</legend>
      <For each={props.options}>
        {option => (
          <label class="segmented-control__option">
            <input
              type="radio"
              name={props.name}
              value={option.value}
              checked={props.selected === option.value}
              onChange={() => props.onChange(option.value)}
              disabled={option.disabled}
            />
            {option.label}
          </label>
        )}
      </For>
    </fieldset>
  )
}