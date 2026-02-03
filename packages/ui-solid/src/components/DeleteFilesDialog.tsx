import { Show } from "solid-js"
import { Portal } from "solid-js/web"
import { AlignEndButtonGroup } from "./buttonGroups/AlignEndButtonGroup"
import { DeleteFilesButton } from "./buttons/DeleteFilesButton"
import { TertiaryButton } from "./buttons/TertiaryButton"
import type { Component } from "solid-js"
import type { IsDestructiveProps } from './buttons/PrimaryDestructiveButton'
import type { VoidFunction } from "shared"

type DeleteFilesDialogProps = IsDestructiveProps & {
  open: boolean
  count: number
  hasSingleSelectedGroupRow: boolean
  onClose: VoidFunction
  onConfirm: VoidFunction
}

export const DeleteFilesDialog: Component<DeleteFilesDialogProps> = props => {
  const handler = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose()
    }
  }

  return (
    <Show when={props.open}>
      <Portal>
        <div
          onMouseDown={handler}
          role="none"
          class="delete-files-dialog__overlay"
        >
          <dialog
            open
            class="surface-dialog"
          >
            <h2>{props.hasSingleSelectedGroupRow ? 'Delete file?' : `Delete ${props.count} selected files?`}</h2>
            <p>
              {props.hasSingleSelectedGroupRow
                ? 'The selected file will be permanently deleted.'
                : `The ${props.count} selected files will be permanently deleted.`}
            </p>
            <AlignEndButtonGroup>
              <TertiaryButton onPress={props.onClose}>Cancel</TertiaryButton>
              <DeleteFilesButton
                hasSingleSelectedGroupRow={props.hasSingleSelectedGroupRow}
                isDestructive={props.isDestructive}
                onPress={props.onConfirm}
              />
            </AlignEndButtonGroup>
          </dialog>
        </div>
      </Portal>
    </Show>
  )
}