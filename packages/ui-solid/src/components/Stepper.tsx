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

export const Stepper: Component<StepperProps> = (props) => {
  function isStepDisabled(index: number): boolean {
    return index > props.lastEnabledStepIndex
  }

  return (
    <div class="stepper">
      <ol>
        <For each={props.labels}>
          {(label, labelIndex) => {
            const index = labelIndex()

            return (
              <li
                classList={{'stepper__steps__active-step': props.onChangeStepIndex() === index}}
              >
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
            disabled={props.onChangeStepIndex() === 0}
            onPress={() => props.onChangeSetStepIndex(decrement(props.onChangeStepIndex()))}
          >
            Back
          </TertiaryButton>
          <TertiaryButton
            disabled={
              isStepDisabled(props.onChangeStepIndex()) || props.onChangeStepIndex() === decrement(props.labels.length)
            }
            onPress={() => props.onChangeSetStepIndex(props.onChangeStepIndex() + 1)}
          >
            Next
          </TertiaryButton>
        </div>
      )}
    </div>
  )
}