import { Button, ButtonVariants } from './Button'
import type { Component } from 'solid-js'
import type { ButtonParentProps } from './Button'

type TertiaryButtonProps = ButtonParentProps

export const TertiaryButton: Component<TertiaryButtonProps> = props => (
  <Button
    {...props}
    variant={ButtonVariants.tertiary}
  />
)