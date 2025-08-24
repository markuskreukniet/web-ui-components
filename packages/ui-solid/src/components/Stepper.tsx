import { For } from 'solid-js'
import { TertiaryButton } from './buttons/TertiaryButton'
import type { Accessor, Component, Setter } from 'solid-js'

type StepperProps = {
  labels: string[]
  lastEnabledStepIndex: number
  showNavigationControls: boolean
  onChangeStepIndex: Accessor<number>
  onChangeSetStepIndex: Setter<number>
}

function decrement(n: number): number {
  return n - 1
}

// TODO: show the active step as active
export const Stepper: Component<StepperProps> = (props) => {
  function isStepDisabled(index: number): boolean {
    return index > props.lastEnabledStepIndex
  }

  const stepIndex = props.onChangeStepIndex()

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
                  onPress={() => props.onChangeSetStepIndex(index)}
                >
                  {label}
                </TertiaryButton>
              </li>
            )
          }}
        </For>
      </ol>
      {props.showNavigationControls && (
        <div>
          <TertiaryButton
            disabled={stepIndex === 0}
            onPress={() => props.onChangeSetStepIndex(decrement(stepIndex))}
          >
            Back
          </TertiaryButton>
          <TertiaryButton
            disabled={isStepDisabled(stepIndex) || stepIndex === decrement(props.labels.length)}
            onPress={() => props.onChangeSetStepIndex(stepIndex + 1)}
          >
            Next
          </TertiaryButton>
        </div>
      )}
    </div>
  )
}