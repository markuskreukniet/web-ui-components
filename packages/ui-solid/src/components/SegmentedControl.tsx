import { For } from 'solid-js'
import type { Component } from 'solid-js'

type SegmentedControlOption = {
  label: string
  value: string
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
      <legend class="display-none">{props.legend}</legend>
      <For each={props.options}>
        {(option) => (
          <label class="segmented-control__option">
            <input
              type="radio"
              name={props.name}
              value={option.value}
              checked={props.selected === option.value}
              onChange={() => props.onChange(option.value)}
            />
            {option.label}
          </label>
        )}
      </For>
    </fieldset>
  )
}