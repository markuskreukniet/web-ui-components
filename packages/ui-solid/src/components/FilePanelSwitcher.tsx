import { createSignal, Show } from 'solid-js'
import { FilePathSelectionForm } from './FilePathSelectionForm'
import { FilePathSelectorMode } from './FilePathSelectorGroup'
import { FileResultInspector } from './FileResultInspector'
import { SegmentedControl } from './SegmentedControl'
import type { Component } from 'solid-js'
import type { OnChangeSourceTargetContextResult } from './FilePathSelectionForm'
import type { FileResultColumns, FileResultRows, OnChangeSelectedRows } from './FileResultTable'
import type { SelectFilePath } from '../types/types'

const FilePanelType = {
  selection: 'selection',
  inspection: 'inspection'
} as const

type FilePanelType = typeof FilePanelType[keyof typeof FilePanelType]

type FilePanelSwitcherProps = {
  columns: FileResultColumns
  rows: FileResultRows
  filePathSelectorMode: FilePathSelectorMode
  singleSelection: boolean
  enableTargetSelection: boolean
  canDelete: boolean
  isLoading: boolean
  selectFilePath: SelectFilePath
  onChangeSourceTargetContextResult: OnChangeSourceTargetContextResult
  onChangeSelectedRows: OnChangeSelectedRows
}

export const FilePanelSwitcher: Component<FilePanelSwitcherProps> = (props) => {
  const [selectedPanel, setSelectedPanel] = createSignal<FilePanelType>(FilePanelType.selection)

  const panel = selectedPanel()

  return (
    <div>
      <SegmentedControl
        name="file-panel-type"
        legend="Select File Panel"
        options={[
          { label: 'File Selection', value: FilePanelType.selection, disabled: false },
          { label: 'File Inspection', value: FilePanelType.inspection, disabled: props.rows.length === 0 }
        ]}
        selected={panel}
        onChange={setSelectedPanel}
      />

      <div>
        <Show when={panel === FilePanelType.selection}>
          <FilePathSelectionForm
            filePathSelectorMode={props.filePathSelectorMode}
            isLoading={props.isLoading}
            singleSelection={props.singleSelection}
            enableTargetSelection={props.enableTargetSelection}
            selectFilePath={props.selectFilePath}
            onChange={props.onChangeSourceTargetContextResult}
          />
        </Show>

        <Show when={panel === FilePanelType.inspection}>
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
