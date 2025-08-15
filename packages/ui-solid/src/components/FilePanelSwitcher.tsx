import { FilePathSelectionForm } from './FilePathSelectionForm'
import { FileResultInspector } from './FileResultInspector'
import { createStep, Stepper } from './Stepper'
import { isArrayEmpty } from '../utils/isEmpty'
import type { Component } from 'solid-js'
import type { FilePathSelectionFormBaseProps, OnChangeSourceTargetContextEither } from './FilePathSelectionForm'
import type { CanDeleteProps } from './FileResultInspector'
import type { FileResultTableDataProps, OnChangeSelectedGroupRowsProps } from './FileResultTable'

type FilePanelSwitcherProps =
  FilePathSelectionFormBaseProps & FileResultTableDataProps & CanDeleteProps & OnChangeSelectedGroupRowsProps & {
  // Declares a separate prop of type OnChangeSourceTargetContextEither
  onChangeSourceTargetContextEither: OnChangeSourceTargetContextEither
}

// TODO: this component is useless? When removing also check props above here
export const FilePanelSwitcher: Component<FilePanelSwitcherProps> = props => {
  return (
    <Stepper
      steps={[
        createStep(
          'File Selection',
          'Select file(s) and/or folder(s)',
          'Choose file(s) and/or folder(s) that you want to check for duplicates.',
          <FilePathSelectionForm
            filePathSelectorMode={props.filePathSelectorMode}
            isLoading={props.isLoading}
            singleSelection={props.singleSelection}
            enableTargetSelection={props.enableTargetSelection}
            selectFilePath={props.selectFilePath}
            onChange={props.onChangeSourceTargetContextEither}
          />,
          'Add file(s) and/or folder(s) to continue'
        ),
        createStep(
          'File Inspection',
          '',
          '',
          <FileResultInspector
            columns={props.columns}
            rowGroups={props.rowGroups}
            isLoading={props.isLoading}
            canDelete={props.canDelete}
            onChange={props.onChangeSelectedGroupRows}
          />,
          ''
        )
      ]}
      lastEnabledStepIndex={isArrayEmpty(props.rowGroups) ? 0 : 1}
      showNavigationControls={false}
    />
  )
}
