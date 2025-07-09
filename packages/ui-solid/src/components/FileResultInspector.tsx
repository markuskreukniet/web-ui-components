import { For, Show } from 'solid-js'
import { DeleteButton, DeleteButtonVariants } from './buttons/DeleteButton'
import {
  createSignalSelectedGroupRow,
  createSignalSelectedGroupRows,
  FileResultColumnTypes,
  FileResultTable
} from './FileResultTable'
import type { Component, JSX } from 'solid-js'
import type { FileResultColumns, FileResultColumnType, OnChangeSelectedGroupRows, RowGroups } from './FileResultTable'

type FileResultInspectorProps = {
  columns: FileResultColumns
  rowGroups: RowGroups
  isLoading: boolean
  canDelete: boolean
  onChange: OnChangeSelectedGroupRows
}

type CellContentRenderer = (cellData: string) => JSX.Element

const baseCellContentRenderers = {
  [FileResultColumnTypes.thumbnail]: (cellData: string) => <img src={cellData} alt="" />
} satisfies Partial<Record<FileResultColumnType, CellContentRenderer>>

export function extendCellRenderers(
  textCellRenderer: CellContentRenderer
): Record<FileResultColumnType, CellContentRenderer> {
  return {
    ...baseCellContentRenderers,
    [FileResultColumnTypes.text]: textCellRenderer
  }
}

const cellContentRenderers = extendCellRenderers(value => <p>{value}</p>)

export const FileResultInspector: Component<FileResultInspectorProps> = (props) => {
  const [selectedGroupRow, setSelectedGroupRow] = createSignalSelectedGroupRow()
  const [selectedGroupRows, setSelectedGroupRows] = createSignalSelectedGroupRows()

  const handler = async () => {
    props.onChange(selectedGroupRows())
  }

  const groupRow = selectedGroupRow()
  const columnRenderers = props.columns.map(column => cellContentRenderers[column.type])

  return (
    <div>
      {props.canDelete && (
        <DeleteButton
          isLoading={props.isLoading}
          disabled={selectedGroupRows().size === 0}
          onPress={handler}
          variant={DeleteButtonVariants.selection}
        />
      )}

      <FileResultTable
        columns={props.columns}
        rowGroups={props.rowGroups}
        showRowCheckboxes={props.canDelete}
        onChangeSelectedGroupRow={setSelectedGroupRow}
        onChangeSelectedGroupRows={setSelectedGroupRows}
      />

      <Show when={groupRow}>
        <div>
          <For each={props.rowGroups[groupRow!.group][groupRow!.row].cells}>
            {(cell, index) => {
              const i = index()

              return (
                <div>
                  <p>{props.columns[i].header}</p>
                  {columnRenderers[i](cell)}
                </div>
              )
            }}
          </For>
        </div>
      </Show>
    </div>
  )
}