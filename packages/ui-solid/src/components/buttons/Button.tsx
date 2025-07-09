import type { Component, JSX } from 'solid-js'

export const ButtonVariants = {
  primary: { id: 'button--primary' }, // TODO: should also be a class
  secondary: { class: 'button--secondary' },
  tertiary: { class: 'button--tertiary' }
} as const

type ButtonVariant = typeof ButtonVariants[keyof typeof ButtonVariants]

export type ButtonBaseProps = {
  disabled: boolean
  onPress: () => void
}

export type ButtonProps = ButtonBaseProps & {
  content: JSX.Element
  variant: ButtonVariant
}

export const Button: Component<ButtonProps> = (props) => (
  <button
    onMouseDown={() => props.onPress()}
    disabled={props.disabled}
    {...props.variant}
  >
    {props.content}
  </button>
)