import { createEffect, createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import type { SubmitButtonProps } from './SubmitButton'

type ButtonProps = SubmitButtonProps & {
  variant: 'primary' | 'secondary' | 'tertiary'
  text: string
}

type VariantAttribute =
  | { id: 'button--primary' }
  | { class: 'button--secondary' | 'button--tertiary' };

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