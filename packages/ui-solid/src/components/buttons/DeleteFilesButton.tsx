import { splitProps, onMount } from 'solid-js';
import { SecondaryButton } from './SecondaryButton'
import type { Component } from 'solid-js'
import type { ButtonParentProps } from './Button'

type DeleteFilesButtonProps = ButtonParentProps & {
  hasSingleSelectedGroupRow: boolean
}

export const DeleteFilesButton: Component<DeleteFilesButtonProps> = props => {
  const [local, rest] = splitProps(props, ['hasSingleSelectedGroupRow'])

  let button: HTMLButtonElement | undefined

  onMount(() => {
    if (button) {
      button.style.width = `${button.getBoundingClientRect().width}px`
    }
  })

  return (
    <SecondaryButton
      ref={button}
      {...rest}
    >
      {local.hasSingleSelectedGroupRow ? 'Delete file' : 'Delete selected files'}
    </SecondaryButton>
  )
}