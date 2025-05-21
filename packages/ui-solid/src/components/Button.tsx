import { createEffect, createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import type { SubmitButtonProps } from './SubmitButton'

export const ButtonVariant = {
  Primary: 'primary',
  Secondary: 'secondary',
  Tertiary: 'tertiary'
} as const

type ButtonVariant = typeof ButtonVariant[keyof typeof ButtonVariant]

type ButtonProps = SubmitButtonProps & {
  variant: ButtonVariant
  text: string
}

type VariantAttribute =
  | { id: 'button--primary' }
  | { class: 'button--secondary' | 'button--tertiary' }; // TODO: duplicate strings

export const Button: Component<ButtonProps> = (props) => {
  const [disabled, setDisabled] = createSignal(false)

  createEffect(() => {
    setDisabled(props.disabled)
  })

  function getVariantAttribute(variant: string): VariantAttribute {
    switch (variant) {
      case 'primary':
        return { id: 'button--primary' }
      case 'secondary':
        return { class: 'button--secondary' }
      default:
        return { class: 'button--tertiary' }
    }
  }

  return (
    <button
      onMouseDown={() => props.onPress()}
      disabled={disabled()}
      {...getVariantAttribute(props.variant)}
    >
      {props.text}
    </button>
  )
}