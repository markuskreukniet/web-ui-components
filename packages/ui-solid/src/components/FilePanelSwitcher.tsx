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
  // Declares a separate prop of type OnChangeSourceTargetContextEither
  onChangeSourceTargetContextEither: OnChangeSourceTargetContextEither
}

export const FilePanelSwitcher: Component<FilePanelSwitcherProps> = (props) => {
  const [stepIndex, setStepIndex] = createSignal(0)

  return (
    <div>
      <Stepper
        labels={['File Selection', 'File Inspection']}
        lastEnabledStepIndex={props.rowGroups.length === 0 ? 0 : 1}
        showNavigationControls={false}
        onChangeStepIndex={stepIndex}
        onChangeSetStepIndex={setStepIndex}
      />

      <div>
        <Show when={stepIndex() === 0}>
          <FilePathSelectionForm
            filePathSelectorMode={props.filePathSelectorMode}
            isLoading={props.isLoading}
            singleSelection={props.singleSelection}
            enableTargetSelection={props.enableTargetSelection}
            selectFilePath={props.selectFilePath}
            onChange={props.onChangeSourceTargetContextEither}
          />
        </Show>

        <Show when={stepIndex() === 1}>
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
