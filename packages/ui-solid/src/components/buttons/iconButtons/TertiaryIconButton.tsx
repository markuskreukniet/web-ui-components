import  { ButtonVariants } from '../Button'
import  { IconButton } from './IconButton'
import type { Component } from 'solid-js'
import type { ButtonParentProps } from '../Button'

type TertiaryIconButtonProps = ButtonParentProps

export const TertiaryIconButton: Component<TertiaryIconButtonProps> = props => (
  <IconButton
    {...props}
    variant={ButtonVariants.tertiary}
  />
)