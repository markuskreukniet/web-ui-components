import { createSignal } from 'solid-js'
import { FilePathSelectionForm } from './FilePathSelectionForm'
import { FilePathSelectorMode } from './FilePathSelectorGroup'
import { FileResultInspector } from './FileResultInspector'
import { SegmentedControl } from './SegmentedControl'
import type { Component } from 'solid-js'
import type { OnChangeSourceTargetContextResult } from './FilePathSelectionForm'
import type { FileResultColumn, FileResultRow } from './FileResultTable'
import type { SelectFilePath } from '../types/types'

const FilePanelType = {
  selection: 'selection',
  inspection: 'inspection'
} as const

type FilePanelType = typeof FilePanelType[keyof typeof FilePanelType]

type FilePanelSwitcherProps = {
  columns: FileResultColumn[]
  rows: FileResultRow[]
  filePathSelectorMode: FilePathSelectorMode
  singleSelection: boolean
  enableTargetSelection: boolean
  isLoading: boolean
  selectFilePath: SelectFilePath
  onChange: OnChangeSourceTargetContextResult
}

const FilePanelSwitcher: Component<FilePanelSwitcherProps> = (props) => {
  const [activePanel, setActivePanel] = createSignal<FilePanelType>(FilePanelType.selection)

  return (
    <div>
      <SegmentedControl
        name="file-panel-mode" // TODO: naming
        legend="Choose File Panel" // TODO: naming
        options={[
          { label: 'Select View', value: FilePanelType.selection }, // TODO: naming
          { label: 'Result View', value: FilePanelType.inspection } // TODO: naming
        ]}
        selected={activePanel()}
        onChange={setActivePanel}
      />

      <div>
        {activePanel() === FilePanelType.selection && (
          <FilePathSelectionForm
            filePathSelectorMode={props.filePathSelectorMode}
            isLoading={props.isLoading}
            singleSelection={props.singleSelection}
            enableTargetSelection={props.enableTargetSelection}
            selectFilePath={props.selectFilePath}
            onChange={props.onChange}
          />
        )}

        {activePanel() === FilePanelType.inspection && (
          <FileResultInspector columns={props.columns} rows={props.rows} />
        )}
      </div>
    </div>
  )
}
