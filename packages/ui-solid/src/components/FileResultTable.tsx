import { createSignal, For } from 'solid-js'
import { extendCellRenderers } from './FileResultInspector'
import type { Component, JSX } from 'solid-js'

export const FileResultColumnType = {
  text: 'text',
  thumbnail: 'thumbnail'
} as const

export type FileResultColumnType = typeof FileResultColumnType[keyof typeof FileResultColumnType]

export type FileResultColumns = {
  header: string,
  type: FileResultColumnType
}[]

export type FileResultRows = { cells: string[] }[]

type RowSelection = number | null

export type SelectedRows = Set<number>

export type OnChangeSelectedRows = (result: SelectedRows) => void

type FileResultTableProps = {
  columns: FileResultColumns
  rows: FileResultRows
  showRowSelectionCheckboxes: boolean
  onChangeSelectedRow: (result: RowSelection) => void
  onChangeSelectedRows: OnChangeSelectedRows
}

export function createSignalRowSelection() {
  return createSignal<RowSelection>(null)
}

export function createSignalSelectedRows() {
  return createSignal<SelectedRows>(new Set())
}

const fileResultCellContentRenderers = extendCellRenderers(cellData => <>{cellData}</>)

function renderHeaderCell(label: string): JSX.Element {
  return (<th>{label}</th>)
}

function renderDataCell(content: JSX.Element): JSX.Element {
  return (<td>{content}</td>)
}

export const FileResultTable: Component<FileResultTableProps> = (props) => {
  const [selectedCheckboxRowIndices, setSelectedCheckboxRowIndices] = createSignalSelectedRows()
  const [selectedRowIndex, setSelectedRowIndex] = createSignalRowSelection()

  const setRowCheckboxState = (index: number, checked: boolean) => {
    setSelectedCheckboxRowIndices(previous => {
      const nextSelectedCheckboxRowIndices = new Set(previous)
      checked ? nextSelectedCheckboxRowIndices.add(index) : nextSelectedCheckboxRowIndices.delete(index)
      return nextSelectedCheckboxRowIndices
    })

    props.onChangeSelectedRows(selectedCheckboxRowIndices())

    if (selectedRowIndex() !== null) {
      setSelectedRowIndex(null)
      props.onChangeSelectedRow(null)
    }
  }

  const handler = (index: number) => {
    if (selectedCheckboxRowIndices().size == 0) {
      const newSelection: RowSelection = selectedRowIndex() === index ? null : index
      setSelectedRowIndex(newSelection)
      props.onChangeSelectedRow(newSelection)
    }
  }

  const cellContentRenderers = props.columns.map(column => fileResultCellContentRenderers[column.type])

  let headerCheckboxCell: JSX.Element = <></>

  // Predefining a no-op renderer avoids adding a conditional inside each row.
  // This approach is also cleaner than representing the checkbox as a column type,
  // since it requires row index access and function-based rendering.
  let rowCheckboxCellRenderer: (index: number) => JSX.Element = (_: number) => <></>

  if (props.showRowSelectionCheckboxes) {
    headerCheckboxCell = renderHeaderCell('')

    rowCheckboxCellRenderer = (index) => {
      return renderDataCell(
        <input
          type="checkbox"
          checked={selectedCheckboxRowIndices().has(index)}
          onChange={(e) => setRowCheckboxState(index, e.currentTarget.checked)}
        />
      )
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <For each={props.columns}>
            {(column) => renderHeaderCell(column.header)}
          </For>
          {headerCheckboxCell}
        </tr>
      </thead>

      <tbody>
        <For each={props.rows}>
          {(row, rowIndex) => {
            const rowI = rowIndex()

            return (
              <tr
                onMouseDown={() => handler(rowI)}
                classList={{'file-result-table__selected-row': selectedRowIndex() === rowI}}
              >
                <For each={row.cells}>
                  {(cell, columnIndex) => renderDataCell(cellContentRenderers[columnIndex()](cell))}
                </For>
                {rowCheckboxCellRenderer(rowI)}
              </tr>
            )
          }}
        </For>
      </tbody>
    </table>
  )
}