import { splitProps } from 'solid-js';
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

export const DeleteButton: Component<DeleteButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ['variant'])

  return (
    <Button
      {...rest}
      content={local.variant === DeleteButtonVariants.single ? 'Delete' : 'Delete selected items'}
      variant={ButtonVariants.secondary}
    />
  )
}