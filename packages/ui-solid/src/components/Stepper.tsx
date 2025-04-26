import { createSignal, For } from 'solid-js'
import { ButtonGroup } from "./buttonGroups/ButtonGroup"
import { TertiaryButton } from './buttons/TertiaryButton'
import { isStrictEqual0 } from 'shared'
import type { Component, JSX } from 'solid-js'

type Step = {
  label: string
  heading: string
  instructions: string
  content: JSX.Element
  hint: string
}

type StepperProps = {
  steps: Step[]
  lastEnabledStepIndex: number
  showNavigationControls: boolean
}

export function createStep(
  label: string, heading: string, instructions: string, content: JSX.Element, hint: string
): Step {
  return {
    label,
    heading,
    instructions,
    content,
    hint
  }
}

function increment(n: number): number {
  return n + 1
}

function decrement(n: number): number {
  return n - 1
}

export const Stepper: Component<StepperProps> = props => {
  const [stepIndex, setStepIndex] = createSignal(0)

  const handler = (n: number) => () => setStepIndex(n)

  // TODO: use step in classList={{'stepper__active-step': stepIndex() === i}}?
  const step = () => props.steps[stepIndex()]

  function isStepDisabled(index: number): boolean {
    return index > props.lastEnabledStepIndex
  }

  return (
    <div class="stepper surface-page">
      <ol>
        <For each={props.steps}>
          {(step, index) => {
            const i = index()

            return (
              <li classList={{'stepper__active-step': stepIndex() === i}}>
                <TertiaryButton
                  disabled={isStepDisabled(i)}
                  onPress={handler(i)}
                >
                  {`${increment(i)}. ${step.label}`}
                </TertiaryButton>
              </li>
            )
          }}
        </For>
      </ol>
      {props.showNavigationControls && (
        <ButtonGroup>
          <TertiaryButton
            disabled={isStrictEqual0(stepIndex())}
            onPress={handler(decrement(stepIndex()))}
          >
            Back
          </TertiaryButton>
          <TertiaryButton
            disabled={isStepDisabled(stepIndex()) || stepIndex() === decrement(props.steps.length)}
            onPress={handler(increment(stepIndex()))}
          >
            Next
          </TertiaryButton>
        </ButtonGroup>
      )}
      <div class="stepper__body">
        <div class="stepper__step-info">
          <h2>{`Step ${increment(stepIndex())} of ${props.steps.length}: ${step().heading}`}</h2>
          <p>{step().instructions}</p>
        </div>
        {step().content}
        <small>{step().hint}</small>
      </div>
    </div>
  )
}