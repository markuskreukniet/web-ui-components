import { createEffect, createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import type { SubmitButtonProps } from './SubmitButton'

export const ButtonAttributes = {
  primary: { id: 'button--primary' },
  secondary: { class: 'button--secondary' },
  tertiary: { class: 'button--tertiary' }
} as const

type ButtonAttributes = typeof ButtonAttributes[keyof typeof ButtonAttributes]

type ButtonProps = SubmitButtonProps & {
  buttonAttributes: ButtonAttributes
  text: string
}

export const Button: Component<ButtonProps> = (props) => {
  const [disabled, setDisabled] = createSignal(false)

  createEffect(() => {
    setDisabled(props.disabled)
  })

  return (
    <button
      onMouseDown={() => props.onPress()}
      disabled={disabled()}
      {...props.buttonAttributes}
    >
      {props.text}
    </button>
  )
}