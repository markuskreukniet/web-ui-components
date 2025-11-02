import { splitProps, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { PrimaryButton } from './PrimaryButton'
import { PrimaryDestructiveButton } from './PrimaryDestructiveButton'
import type { Component } from 'solid-js'
import type { ButtonParentProps } from './Button'
import type { IsDestructiveProps } from './PrimaryDestructiveButton'

type DeleteFilesButtonProps = ButtonParentProps & IsDestructiveProps & {
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
    <Dynamic
      component={props.isDestructive ? PrimaryDestructiveButton : PrimaryButton}
      ref={button}
      {...rest}
    >
      {local.hasSingleSelectedGroupRow ? 'Delete file' : 'Delete selected files'}
    </Dynamic>
  )
}