import { Button, ButtonVariants } from './Button'
import type { Component } from 'solid-js'
import type { ButtonParentProps } from './Button'

type PrimaryButtonProps = ButtonParentProps

export const PrimaryButton: Component<PrimaryButtonProps> = props => (
  <Button
    {...props}
    variant={ButtonVariants.primary}
  />
)