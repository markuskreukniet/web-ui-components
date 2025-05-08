import { createSignal, For } from 'solid-js'
import { extendCellRenderers } from './FileResultInspector'
import type { Component } from 'solid-js'

export const FileResultColumnType = {
  text: 'text',
  thumbnail: 'thumbnail'
} as const

export type FileResultColumnType = typeof FileResultColumnType[keyof typeof FileResultColumnType]

export type FileResultColumn = {
  header: string,
  type: FileResultColumnType
}

export type FileResultRow = {
  cells: string[]
}

type RowSelection = number | null

type FileResultTableProps = {
  columns: FileResultColumn[]
  rows: FileResultRow[]
  onChange: (result: RowSelection) => void
}

export function createSignalRowSelection() {
  return createSignal<RowSelection>(null)
}

const fileResultCellContentRenderers = extendCellRenderers(value => <>{value}</>)

export const FileResultTable: Component<FileResultTableProps> = (props) => {
  const [selectedRowIndex, setSelectedRowIndex] = createSignalRowSelection()

  const handler = (index: number) => {
    const newSelection: RowSelection = selectedRowIndex() === index ? null : index
    setSelectedRowIndex(newSelection)
    props.onChange(newSelection)
  }

  const cellContentRenderers = props.columns.map(col => fileResultCellContentRenderers[col.type])

  return (
    <table>
      <tr>
        <For each={props.columns}>
          {(column) => (
            <th>{column.header}</th>
          )}
        </For>
      </tr>

      <For each={props.rows}>
        {(row, rowIndex) => (
          <tr
            onMouseDown={() => handler(rowIndex())}
            classList={{'file-result-table__selected-row': selectedRowIndex() === rowIndex()}}
          >
            <For each={row.cells}>
              {(cell, columnIndex) => (
                <td>{cellContentRenderers[columnIndex()](cell)}</td>
              )}
            </For>
          </tr>
        )}
      </For>
    </table>
  )
}