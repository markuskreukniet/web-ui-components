import { Button, ButtonVariants } from './Button'
import type { Component } from 'solid-js'
import type { ButtonParentProps } from './Button'

type SecondaryButtonProps = ButtonParentProps

export const SecondaryButton: Component<SecondaryButtonProps> = props => (
  <Button
    {...props}
    variant={ButtonVariants.secondary}
  />
)