import { Button, ButtonVariants } from './Button'
import type { Component } from 'solid-js'
import type { ButtonBaseProps } from './Button'

type SubmitButtonProps = ButtonBaseProps

export const SubmitButton: Component<SubmitButtonProps> = props => (
  <Button
    {...props}
    variant={ButtonVariants.primary}
  >
    submit
  </Button>
)