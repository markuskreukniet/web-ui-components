import { createSignal, For } from 'solid-js'
import { right } from '../monads/either'
import type { Component, JSX } from 'solid-js'
import type { Either } from '../monads/either'

const FileResultColumnType = {
  text: 'text',
  thumbnail: 'thumbnail'
} as const

type FileResultColumnType = typeof FileResultColumnType[keyof typeof FileResultColumnType]

export type FileResultColumn = {
  header: string,
  type: FileResultColumnType
}

export type FileResultRow = {
  cells: string[]
}

type RowSelection = number | null

export type OnChangeRowSelection = (result: Either<Error, RowSelection>) => void

type FileResultTableProps = {
  columns: FileResultColumn[]
  rows: FileResultRow[]
  onChange: OnChangeRowSelection
}

// TODO: naming + can it be more efficient? 'value => value' seems strange
const renderFileResultCell: Record<FileResultColumnType, (value: string) => string | JSX.Element> = {
  [FileResultColumnType.thumbnail]: value => <img src={value} alt="" />,
  [FileResultColumnType.text]: value => value
}

export const FileResultTable: Component<FileResultTableProps> = (props) => {
  const [selectedRow, setSelectedRow] = createSignal<RowSelection>(null)

  const handler = (index: number) => {
    const newSelection: RowSelection = selectedRow() === index ? null : index
    setSelectedRow(newSelection)
    props.onChange(right(newSelection))
  }

  const renderCellPerColumn = props.columns.map(col => renderFileResultCell[col.type]) // TODO: naming

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
            classList={{'file-result-table__selected-row': selectedRow() === rowIndex()}}
          >
            <For each={row.cells}>
              {(cell, columnIndex) => (
                <td>{renderCellPerColumn[columnIndex()](cell)}</td>
              )}
            </For>
          </tr>
        )}
      </For>
    </table>
  )
}