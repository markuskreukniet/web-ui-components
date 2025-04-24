import { Button, ButtonVariants } from './Button'
import type { Component } from 'solid-js'
import type { ButtonBaseProps } from './Button'

export const DeleteButtonVariants = {
  single: 'single',
  selection: 'selection'
} as const

type DeleteButtonVariant = typeof DeleteButtonVariants[keyof typeof DeleteButtonVariants]

type DeleteButtonProps = ButtonBaseProps & {
  variant: DeleteButtonVariant
}

export const DeleteButton: Component<DeleteButtonProps> = ({ variant, ...restProps }) => (
  <Button
    {...restProps}
    content={variant === DeleteButtonVariants.single ? 'Delete' : 'Delete selected items'}
    variant={ButtonVariants.secondary}
  />
)