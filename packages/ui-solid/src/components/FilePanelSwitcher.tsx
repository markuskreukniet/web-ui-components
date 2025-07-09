import { createSignal, Show } from 'solid-js'
import { FilePathSelectionForm } from './FilePathSelectionForm'
import { FileResultInspector } from './FileResultInspector'
import { SegmentedControl } from './SegmentedControl'
import type { Component } from 'solid-js'
import type { OnChangeSourceTargetContextEither } from './FilePathSelectionForm'
import type { FilePathSelectorMode } from './FilePathSelectorGroup'
import type { FileResultColumns, FileResultRows, OnChangeSelectedRows } from './FileResultTable'
import type { SelectFilePath } from '../types/types'

const FilePanelTypes = {
  selection: 'selection',
  inspection: 'inspection'
} as const

type FilePanelType = typeof FilePanelTypes[keyof typeof FilePanelTypes]

type FilePanelSwitcherProps = {
  columns: FileResultColumns
  rows: FileResultRows
  filePathSelectorMode: FilePathSelectorMode
  singleSelection: boolean
  enableTargetSelection: boolean
  canDelete: boolean
  isLoading: boolean
  selectFilePath: SelectFilePath
  onChangeSourceTargetContextEither: OnChangeSourceTargetContextEither
  onChangeSelectedRows: OnChangeSelectedRows
}

export const FilePanelSwitcher: Component<FilePanelSwitcherProps> = (props) => {
  const [selectedPanel, setSelectedPanel] = createSignal<FilePanelType>(FilePanelTypes.selection)

  const panel = selectedPanel()

  return (
    <div>
      <SegmentedControl
        name="file-panel-type"
        legend="Select File Panel"
        options={[
          { label: 'File Selection', value: FilePanelTypes.selection, disabled: false },
          { label: 'File Inspection', value: FilePanelTypes.inspection, disabled: props.rows.length === 0 }
        ]}
        selected={panel}
        onChange={setSelectedPanel}
      />

      <div>
        <Show when={panel === FilePanelTypes.selection}>
          <FilePathSelectionForm
            filePathSelectorMode={props.filePathSelectorMode}
            isLoading={props.isLoading}
            singleSelection={props.singleSelection}
            enableTargetSelection={props.enableTargetSelection}
            selectFilePath={props.selectFilePath}
            onChange={props.onChangeSourceTargetContextEither}
          />
        </Show>

        <Show when={panel === FilePanelTypes.inspection}>
          <FileResultInspector
            columns={props.columns}
            rows={props.rows}
            isLoading={props.isLoading}
            canDelete={props.canDelete}
            onChange={props.onChangeSelectedRows}
          />
        </Show>
      </div>
    </div>
  )
}
