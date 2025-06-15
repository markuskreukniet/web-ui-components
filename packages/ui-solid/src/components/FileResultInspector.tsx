import { For, Show } from 'solid-js'
import { DeleteButton, DeleteButtonVariants } from './buttons/DeleteButton'
import {
  createSignalRowSelection,
  createSignalSelectedRows,
  FileResultColumnType,
  FileResultTable
} from './FileResultTable'
import type { Component, JSX } from 'solid-js'
import type { FileResultColumn, FileResultRow, SelectedRows } from './FileResultTable'

type FileResultInspectorProps = {
  columns: FileResultColumn[]
  rows: FileResultRow[]
  isLoading: boolean
  canDelete: boolean
  onChange: (rows: SelectedRows) => void // TODO: duplicate type
}

type CellContentRenderer = (cellData: string) => JSX.Element

const baseCellContentRenderers = {
  [FileResultColumnType.thumbnail]: (cellData: string) => <img src={cellData} alt="" />
} satisfies Partial<Record<FileResultColumnType, CellContentRenderer>>;

export function extendCellRenderers(
  textCellRenderer: CellContentRenderer
): Record<FileResultColumnType, CellContentRenderer> {
  return {
    ...baseCellContentRenderers,
    [FileResultColumnType.text]: textCellRenderer
  };
}

const cellContentRenderers = extendCellRenderers(value => <p>{value}</p>);

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
            {(cell, index) => (
              <div>
                <p>{props.columns[index()].header}</p>
                {columnRenderers[index()](cell)}
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}