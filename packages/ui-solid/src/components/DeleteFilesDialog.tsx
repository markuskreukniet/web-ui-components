import { Show } from "solid-js"
import { Portal } from "solid-js/web"
import { DeleteFilesButton } from "./buttons/DeleteFilesButton"
import { TertiaryButton } from "./buttons/TertiaryButton"
import type { Component } from "solid-js"
import type { VoidFunction } from "../types/types"

type DeleteFilesDialogProps = {
  open: boolean
  count: number
  single: boolean
  onClose: VoidFunction
  onConfirm: VoidFunction
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
            <DeleteFilesButton
              single={props.single}
              onPress={props.onConfirm}
            />
          </div>
        </div>
      </div>
    </Portal>
  </Show>
)
