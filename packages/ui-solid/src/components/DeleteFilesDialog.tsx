import { Show } from "solid-js"
import { Portal } from "solid-js/web"
import { DeleteFilesButton } from "./buttons/DeleteFilesButton"
import { TertiaryButton } from "./buttons/TertiaryButton"
import type { Component } from "solid-js"

type DeleteFilesDialogProps = {
  open: boolean
  count: number
  onClose: () => void
  onConfirm: () => void // TODO: duplicate type
}

// TODO: WIP + on inside div e.stopPropagation (is needed?) + ARIA or role + div with onMouseDown duplicate
export const DeleteFilesDialog: Component<DeleteFilesDialogProps> = props => (
  <Show when={props.open}>
    <Portal>
      <div
        onMouseDown={props.onClose}
        role="none"
      >
        <div
          onMouseDown={(e) => e.stopPropagation()}
        >
          <h2>Delete {props.count} files?</h2>
          <p>These {props.count} selected files will be permanently deleted.</p>
          <div>
            <TertiaryButton
              onPress={props.onClose}
            >
              Cancel
            </TertiaryButton>
            {/* TODO: duplicate === 1 */}
            <DeleteFilesButton
              single={props.count === 1}
              onPress={props.onConfirm}
            />
          </div>
        </div>
      </div>
    </Portal>
  </Show>
)
