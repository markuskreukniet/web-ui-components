import { createSignal, For } from 'solid-js'
import type { Component } from 'solid-js'
import type { Either } from '../monads/either'

const FileResultColumnType = {
  text: 'text',
  thumbnail: 'thumbnail'
} as const

type FileResultColumnType = typeof FileResultColumnType[keyof typeof FileResultColumnType]

type FileResultColumn = {
  header: string,
  type: FileResultColumnType
}

type FileResultRow = {
  cells: string[]
}

type FileResultTableProps = {
  columns: FileResultColumn[]
  rows: FileResultRow[]
  onChange: (result: Either<Error, string>) => void
}

export const FileResultTable: Component<FileResultTableProps> = (props) => {
  const [selectedRow, setSelectedRow] = createSignal<number | null>(null);

  const cellClassPerColumn = props.columns.map(col =>
    col.type === FileResultColumnType.thumbnail ? 'file-result-table__thumbnail' : ''
  );

  return (
    <table>
      <tr>
        <For each={props.columns}>
          {(columns) => (
            <th>{columns.header}</th>
          )}
        </For>
      </tr>

      <For each={props.rows}>
        {(row, index) => (
          <tr
            onMouseDown={() => setSelectedRow(index())}
            classList={{'file-result-table__selected-row': selectedRow() === index()}}
          >
            <For each={row.cells}>
              {(cell, index) => (
                <tr class={cellClassPerColumn[index()]}>{cell}</tr>
              )}
            </For>
          </tr>
        )}
      </For>
    </table>
  )
}