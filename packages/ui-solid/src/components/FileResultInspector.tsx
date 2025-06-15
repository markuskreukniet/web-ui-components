import { For, Show } from 'solid-js'
import { createSignalRowSelection, FileResultColumnType, FileResultTable } from './FileResultTable'
import type { Component, JSX } from 'solid-js'
import type { FileResultColumn, FileResultRow } from './FileResultTable'

type FileResultInspectorProps = {
  columns: FileResultColumn[]
  rows: FileResultRow[]
}

type CellContentRenderer = (value: string) => JSX.Element // TODO: value naming

const baseCellContentRenderers = {
  [FileResultColumnType.thumbnail]: (value: string) => <img src={value} alt="" />, // TODO: value naming
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
  const [rowSelectionIndex, setRowSelectionIndex] = createSignalRowSelection()

  const selectedRowIndex = rowSelectionIndex();
  const columnRenderers = props.columns.map(col => cellContentRenderers[col.type])

  return (
    <div>
      <FileResultTable columns={props.columns} rows={props.rows} onChange={setRowSelectionIndex} />

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