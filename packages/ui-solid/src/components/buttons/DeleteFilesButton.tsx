import { splitProps, onMount } from 'solid-js';
import { SecondaryButton } from './SecondaryButton'
import type { Component } from 'solid-js'
import type { ButtonParentProps } from './Button'

type DeleteFilesButtonProps = ButtonParentProps & {
  single: boolean
}

export const DeleteFilesButton: Component<DeleteFilesButtonProps> = props => {
  const [local, rest] = splitProps(props, ['single'])

  let button: HTMLButtonElement | undefined

  // TODO: use same if style on other places
  onMount(() => {
    if (button) button.style.width = `${button.getBoundingClientRect().width}px`
  })

  return (
    <SecondaryButton
      ref={button}
      {...rest}
    >
      {local.single ? 'Delete file' : 'Delete selected files'}
    </SecondaryButton>
  )
}