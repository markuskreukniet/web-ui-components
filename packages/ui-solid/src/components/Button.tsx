import { createEffect, createSignal } from 'solid-js'
import type { Component } from 'solid-js'

export const ButtonAttributes = {
  primary: { id: 'button--primary' },
  secondary: { class: 'button--secondary' },
  tertiary: { class: 'button--tertiary' }
} as const

type ButtonAttributes = typeof ButtonAttributes[keyof typeof ButtonAttributes]

export type ButtonBaseProps = {
  disabled: boolean
  onPress: () => void
}

type ButtonProps = ButtonBaseProps & {
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