import { createSignal } from 'solid-js'
import { FilePathSelectionForm } from './FilePathSelectionForm'
import { FileResultTable } from './FileResultTable'
import { SegmentedControl } from './SegmentedControl'
import type { Component } from 'solid-js'
import type { FileResultColumn, FileResultRow, OnChangeRowSelection } from './FileResultTable'

const Panel = {
  select: 'select',
  result: 'result'
} as const

type Panel = typeof Panel[keyof typeof Panel]

type FilePanelSwitcherProps = {
  columns: FileResultColumn[] // TODO: naming
  rows: FileResultRow[] // TODO: naming
  onChangeRowSelection: OnChangeRowSelection
}

// TODO: WIP

const FilePanelSwitcher: Component<FilePanelSwitcherProps> = (props) => {
  const [activePanel, setActivePanel] = createSignal<Panel>(Panel.select)

  return (
    <div>
      <SegmentedControl
        name="file-panel-mode"
        legend="Choose File Panel"
        options={[
          { label: 'Select View', value: Panel.select },
          { label: 'Result View', value: Panel.result }
        ]}
        selected={activePanel()}
        onChange={setActivePanel}
      />

      <div>
        {activePanel() === Panel.select && (
          <FilePathSelectionForm />
        )}

        {activePanel() === Panel.result && (
          <FileResultTable columns={props.columns} rows={props.rows} onChange={props.onChangeRowSelection} />
        )}
      </div>
    </div>
  )
}
