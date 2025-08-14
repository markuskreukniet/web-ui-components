import { createSignal, Show } from 'solid-js'
import { FilePathSelectionForm } from './FilePathSelectionForm'
import { FileResultInspector } from './FileResultInspector'
import { Stepper } from './Stepper'
import type { Component } from 'solid-js'
import type { FilePathSelectionFormBaseProps, OnChangeSourceTargetContextEither } from './FilePathSelectionForm'
import type { CanDeleteProps } from './FileResultInspector'
import type { FileResultTableDataProps, OnChangeSelectedGroupRowsProps } from './FileResultTable'

type FilePanelSwitcherProps =
  FilePathSelectionFormBaseProps & FileResultTableDataProps & CanDeleteProps & OnChangeSelectedGroupRowsProps & {
  onChangeSourceTargetContextEither: OnChangeSourceTargetContextEither
}

export const FilePanelSwitcher: Component<FilePanelSwitcherProps> = (props) => {
  const [activeStepIndex, setActiveStepIndex] = createSignal(0)

  const index = activeStepIndex()

  return (
    <div>
      <Stepper
        labels={['File Selection', 'File Inspection']}
        lastEnabledStepIndex={props.rowGroups.length === 0 ? 0 : 1}
        onChange={setActiveStepIndex}
      />

      <div>
        <Show when={index === 0}>
          <FilePathSelectionForm
            filePathSelectorMode={props.filePathSelectorMode}
            isLoading={props.isLoading}
            singleSelection={props.singleSelection}
            enableTargetSelection={props.enableTargetSelection}
            selectFilePath={props.selectFilePath}
            onChange={props.onChangeSourceTargetContextEither}
          />
        </Show>

        <Show when={index === 1}>
          <FileResultInspector
            columns={props.columns}
            rowGroups={props.rowGroups}
            isLoading={props.isLoading}
            canDelete={props.canDelete}
            onChange={props.onChangeSelectedGroupRows}
          />
        </Show>
      </div>
    </div>
  )
}
