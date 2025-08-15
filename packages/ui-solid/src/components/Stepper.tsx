import { createSignal, For } from 'solid-js'
import { TertiaryButton } from './buttons/TertiaryButton'
import type { Component } from 'solid-js'

type StepperProps = {
  labels: string[]
  lastEnabledStepIndex: number
  onChange: (index: number) => void
}

function decrement(n: number): number {
  return n - 1
}

export const Stepper: Component<StepperProps> = (props) => {
  const [currentStepIndex, setCurrentStepIndex] = createSignal(0)

  function updateCurrentStepIndex(index: number): void {
    setCurrentStepIndex(index)
    props.onChange(index)
  }

  function isStepDisabled(index: number): boolean {
    return index > props.lastEnabledStepIndex
  }

  const stepIndex = currentStepIndex()

  return (
    <div class="stepper">
      <ol>
        <For each={props.labels}>
          {(label, labelIndex) => {
            const index = labelIndex()

            return (
              <li>
                <TertiaryButton
                  disabled={isStepDisabled(index)}
                  onPress={() => updateCurrentStepIndex(index)}
                  content={label}
                />
              </li>
            )
          }}
        </For>
      </ol>
      <div>
        <TertiaryButton
          disabled={stepIndex === 0}
          onPress={() => updateCurrentStepIndex(decrement(stepIndex))}
          content="Previous"
        />
        <TertiaryButton
          disabled={isStepDisabled(stepIndex) || stepIndex === decrement(props.labels.length)}
          onPress={() => updateCurrentStepIndex(stepIndex + 1)}
          content="Next"
        />
      </div>
    </div>
  )
}