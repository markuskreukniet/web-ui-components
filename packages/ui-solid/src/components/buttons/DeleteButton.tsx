import { ButtonVariants } from './Button'
import { LoadingButton } from './LoadingButton'
import type { Component } from 'solid-js'
import type { LoadingButtonBaseProps } from './LoadingButton'

export const DeleteButtonVariants = {
  single: 'single',
  selection: 'selection'
} as const

type DeleteButtonVariant = typeof DeleteButtonVariants[keyof typeof DeleteButtonVariants]

type DeleteButtonProps = LoadingButtonBaseProps & {
  variant: DeleteButtonVariant
}

export const DeleteButton: Component<DeleteButtonProps> = (props) => {
  return (
    <LoadingButton
      isLoading={props.isLoading}
      disabled={props.disabled}
      onPress={props.onPress}
      content={props.variant == DeleteButtonVariants.single ? 'Delete' : 'Delete selected items'}
      variant={ButtonVariants.secondary}
    />
  )
}