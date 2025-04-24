import  { Button, ButtonVariants } from './Button'
import type { Component } from 'solid-js'
import type { ButtonContentProps } from './Button'

type TertiaryButtonProps = ButtonContentProps

export const TertiaryButton: Component<TertiaryButtonProps> = (props) => (
  <Button {...props} variant={ButtonVariants.tertiary} />
)