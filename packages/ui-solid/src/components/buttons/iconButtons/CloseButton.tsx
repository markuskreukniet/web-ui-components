import  { TertiaryIconButton } from './TertiaryIconButton'
import type { Component } from 'solid-js'
import type { ButtonBaseProps } from '../Button'

type CloseButtonProps = ButtonBaseProps

export const CloseButton: Component<CloseButtonProps> = props => (
  <TertiaryIconButton {...props}>
    <line x1="3" y1="3" x2="21" y2="21" />
    <line x1="21" y1="3" x2="3" y2="21" />
  </TertiaryIconButton>
)