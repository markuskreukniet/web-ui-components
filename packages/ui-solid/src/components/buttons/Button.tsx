import { ProgressCircle } from '../ProgressCircle'
import type { Component, JSX } from 'solid-js'

export const ButtonVariants = {
  primary: 'button--primary',
  secondary: 'button--secondary',
  tertiary: 'button--tertiary'
} as const

type ButtonVariant = typeof ButtonVariants[keyof typeof ButtonVariants]

export type ButtonBaseProps = {
  disabled?: boolean
  isLoading?: boolean
  onPress: () => void
}

export type ButtonContentProps = ButtonBaseProps & {
  content: JSX.Element
}

type ButtonProps = ButtonContentProps & {
  variant: ButtonVariant
}

export const Button: Component<ButtonProps> = (props) => (
  <button
    onMouseDown={() => props.onPress()}
    disabled={props.disabled || props.isLoading}
    class={props.variant}
  >
    {props.isLoading ? <span><ProgressCircle />{props.content}</span> : props.content}
  </button>
)