import  { ButtonVariants } from '../Button'
import  { IconButton } from './IconButton'
import type { Component } from 'solid-js'
import type { ButtonContentProps } from '../Button'

type TertiaryIconButtonProps = ButtonContentProps

export const TertiaryIconButton: Component<TertiaryIconButtonProps> = (props) => (
  <IconButton {...props} variant={ButtonVariants.tertiary} />
)