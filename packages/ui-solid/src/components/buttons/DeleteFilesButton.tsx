import { splitProps } from 'solid-js';
import { SecondaryButton } from './SecondaryButton'
import type { Component } from 'solid-js'
import type { ButtonParentProps } from './Button'

type DeleteFilesButtonProps = ButtonParentProps & {
  single: boolean
}

export const DeleteFilesButton: Component<DeleteFilesButtonProps> = props => {
  const [local, rest] = splitProps(props, ['single'])

  return (
    <SecondaryButton
      {...rest}
    >
      {local.single ? 'Delete file' : 'Delete selected files'}
    </SecondaryButton>
  )
}