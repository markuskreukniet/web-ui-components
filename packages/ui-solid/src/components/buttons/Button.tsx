import type { Component, JSX } from 'solid-js'

export const ButtonVariants = {
  primary: { id: 'button--primary' },
  secondary: { class: 'button--secondary' },
  tertiary: { class: 'button--tertiary' }
} as const

type ButtonVariant = typeof ButtonVariants[keyof typeof ButtonVariants]

export type ButtonBaseProps = {
  disabled: boolean
  onPress: () => void
}

type ButtonProps = ButtonBaseProps & {
  variant: ButtonVariant
  content: string | JSX.Element
}

export const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      onMouseDown={() => props.onPress()}
      disabled={props.disabled}
      {...props.variant}
    >
      {props.content}
    </button>
  )
}