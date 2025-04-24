import { createSignal, For } from 'solid-js'
import { extendCellRenderers } from './FileResultInspector'
import type { Component, JSX } from 'solid-js'

export const FileResultColumnTypes = {
  text: 'text',
  thumbnail: 'thumbnail'
} as const

export type FileResultColumnType = typeof FileResultColumnTypes[keyof typeof FileResultColumnTypes]

export type FileResultColumns = {
  header: string,
  type: FileResultColumnType
}[]

export type RowGroup = { cells: string[] }[]

export type RowGroups = RowGroup[]

type GroupRow = {
  group: number
  row: number
}

type SelectedGroupRow = GroupRow | null

// Maps group indices to sets of selected row indices, used consistently for input and output.
export type SelectedGroupRows = Map<number, Set<number>>

export type OnChangeSelectedGroupRows = (rows: SelectedGroupRows) => void

export type FileResultTableDataProps = {
  columns: FileResultColumns
  rowGroups: RowGroups
}

export type OnChangeSelectedGroupRowsProps = {
  onChangeSelectedGroupRows: OnChangeSelectedGroupRows
}

type FileResultTableProps = FileResultTableDataProps & OnChangeSelectedGroupRowsProps & {
  showRowCheckboxes: boolean
  onChangeSelectedGroupRow: (row: SelectedGroupRow) => void
}

export function createSignalSelectedGroupRow() {
  return createSignal<SelectedGroupRow>(null)
}

export function createSignalSelectedGroupRows() {
  return createSignal<SelectedGroupRows>(new Map())
}

function renderHeaderCell(label: string): JSX.Element {
  return (<th>{label}</th>)
}

function renderDataCell(content: JSX.Element): JSX.Element {
  return (<td>{content}</td>)
}

export const FileResultTable: Component<FileResultTableProps> = (props) => {
  const [selectedGroupRow, setSelectedGroupRow] = createSignalSelectedGroupRow()
  const [selectedGroupRows, setSelectedGroupRows] = createSignalSelectedGroupRows()

  // Do not invoke extendCellRenderers at module scope, as it runs immediately during module initialization.
  // This led to a runtime error when an internal dependency was accessed before it was declared.
  // Move the call inside FileResultTable to defer execution until render time,
  // ensuring all dependencies are safely initialized.
  const fileResultCellContentRenderers = extendCellRenderers(cellData => cellData) // TODO: naming and working makes sense?

  function updateSelectedGroupRow(row: SelectedGroupRow) {
    setSelectedGroupRow(row)
    props.onChangeSelectedGroupRow(row)
  }

  const setRowCheckboxState = (groupI: number, rowI: number, checked: boolean) => {
    setSelectedGroupRows((current: SelectedGroupRows) => {
      const next = new Map(current)
      const rows = next.has(groupI) ? next.get(groupI)! : new Set<number>()

      function setGroupRows() {
        next.set(groupI, rows)
      }

      if (checked) {
        rows.add(rowI)
        setGroupRows()
      }

      if (!checked) {
        rows.delete(rowI)
        if (!rows.size) {
          next.delete(groupI)
        } else {
          setGroupRows()
        }
      }

      return next
    })

    props.onChangeSelectedGroupRows(selectedGroupRows())

    if (!selectedGroupRow()) {
      updateSelectedGroupRow(null)
    }
  }

  const handler = (groupI: number, rowI: number) => {
    if (selectedGroupRows().size === 0) {
      const row = selectedGroupRow()
      updateSelectedGroupRow((!row || (row.group !== groupI || row.row !== rowI)) ? { group: groupI, row: rowI } : null)
    }
  }

  const cellContentRenderers = props.columns.map(column => fileResultCellContentRenderers[column.type]) // TODO: naming

  let headerCheckboxCell: JSX.Element = null

  // A no-op renderer avoids conditional logic in the row rendering loop.
  // Checkbox rendering is kept separate from the column model, as it depends on row indices
  // and imperative updates that violate the declarative rendering model.
  let renderCheckbox: (_i: number, _j: number) => JSX.Element = (_i: number, _j: number) => null

  if (props.showRowCheckboxes) {
    headerCheckboxCell = renderHeaderCell('')

    renderCheckbox = (groupI, rowI) => {
      return renderDataCell(
        <input
          type="checkbox"
          checked={selectedGroupRows().get(groupI)?.has(rowI)}
          onChange={(e) => setRowCheckboxState(groupI, rowI, e.currentTarget.checked)}
        />
      )
    }
  }

  return (
    <table>
      <thead>
        <tr>
          {headerCheckboxCell}
          <For each={props.columns}>
            {(column) => renderHeaderCell(column.header)}
          </For>
        </tr>
      </thead>

      <For each={props.rowGroups}>
        {(group, groupIndex) => {
          const groupI = groupIndex()

          return (
            <tbody>
              <For each={group}>
                {(row, rowIndex) => {
                  const rowI = rowIndex()
                  const currentRow = selectedGroupRow()

                  return (
                    <tr
                      onMouseDown={() => handler(groupI, rowI)}
                      classList={{
                        'file-result-table__selected-row': currentRow?.group === groupI && currentRow?.row === rowI
                      }}
                    >
                      {renderCheckbox(groupI, rowI)}
                      <For each={row.cells}>
                        {(cell, cellIndex) => renderDataCell(cellContentRenderers[cellIndex()](cell))}
                      </For>
                    </tr>
                  )
                }}
              </For>
            </tbody>
          )
        }}
      </For>
    </table>
  )
}