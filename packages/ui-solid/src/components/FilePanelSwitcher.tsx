import { createSignal, Show } from 'solid-js'
import { FilePathSelectionForm } from './FilePathSelectionForm'
import { FileResultInspector } from './FileResultInspector'
import { SegmentedControl } from './SegmentedControl'
import type { Component } from 'solid-js'
import type { FilePathSelectionFormBaseProps, OnChangeSourceTargetContextEither } from './FilePathSelectionForm'
import type { CanDeleteProps } from './FileResultInspector'
import type { FileResultTableDataProps, OnChangeSelectedGroupRowsProps } from './FileResultTable'

const FilePanelTypes = {
  selection: 'selection',
  inspection: 'inspection'
} as const

type FilePanelType = typeof FilePanelTypes[keyof typeof FilePanelTypes]

type FilePanelSwitcherProps =
  FilePathSelectionFormBaseProps & FileResultTableDataProps & CanDeleteProps & OnChangeSelectedGroupRowsProps & {
  onChangeSourceTargetContextEither: OnChangeSourceTargetContextEither
}

export const FilePanelSwitcher: Component<FilePanelSwitcherProps> = (props) => {
  const [selectedPanel, setSelectedPanel] = createSignal<FilePanelType>(FilePanelTypes.selection)

  const panel = selectedPanel()

  // TODO: function for option creation
  return (
    <div>
      <SegmentedControl
        name="file-panel-type"
        legend="Select File Panel"
        options={[
          { label: 'File Selection', value: FilePanelTypes.selection, disabled: false },
          { label: 'File Inspection', value: FilePanelTypes.inspection, disabled: props.rowGroups.length === 0 }
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
