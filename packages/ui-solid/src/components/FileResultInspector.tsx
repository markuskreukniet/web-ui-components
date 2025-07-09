import { For, Show } from 'solid-js'
import { DeleteButton, DeleteButtonVariants } from './buttons/DeleteButton'
import {
  createSignalSelectedGroupRow,
  createSignalSelectedGroupRows,
  FileResultColumnTypes,
  FileResultTable
} from './FileResultTable'
import type { Component, JSX } from 'solid-js'
import type { FileResultColumns, FileResultColumnType, FileResultRows, OnChangeSelectedRows } from './FileResultTable'

type FileResultInspectorProps = {
  columns: FileResultColumns
  rows: FileResultRows
  isLoading: boolean
  canDelete: boolean
  onChange: OnChangeSelectedRows
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
  const [selectedRow, setSelectedRow] = createSignalRowSelection()
  const [selectedRows, setSelectedRows] = createSignalSelectedRows()

  const handler = async () => {
    props.onChange(selectedRows())
  }

  const selectedRowIndex = selectedRow();
  const columnRenderers = props.columns.map(column => cellContentRenderers[column.type])

  return (
    <div>
      {props.canDelete && (
        <DeleteButton
          isLoading={props.isLoading}
          disabled={selectedRows().size === 0}
          onPress={handler}
          variant={DeleteButtonVariants.selection}
        />
      )}

      <FileResultTable
        columns={props.columns}
        rows={props.rows}
        showRowSelectionCheckboxes={props.canDelete}
        onChangeSelectedRow={setSelectedRow}
        onChangeSelectedRows={setSelectedRows}
      />

      <Show when={selectedRowIndex !== null}>
        <div>
          <For each={props.rows[selectedRowIndex!].cells}>
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