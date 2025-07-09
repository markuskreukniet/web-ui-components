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

export type RowGroups = { cells: string[] }[][]

type GroupRow = {
  group: number
  row: number
}

type SelectedGroupRow = GroupRow | null

export type SelectedGroupRows = Set<string>

export type OnChangeSelectedGroupRows = (rows: SelectedGroupRows) => void

type FileResultTableProps = {
  columns: FileResultColumns
  rowGroups: RowGroups
  showRowCheckboxes: boolean
  onChangeSelectedGroupRow: (row: SelectedGroupRow) => void
  onChangeSelectedGroupRows: OnChangeSelectedGroupRows
}

export function createSignalSelectedGroupRow() {
  return createSignal<SelectedGroupRow>(null)
}

export function createSignalSelectedGroupRows() {
  return createSignal<SelectedGroupRows>(new Set())
}

const fileResultCellContentRenderers = extendCellRenderers(cellData => cellData) // TODO: naming and working makes sense?

function renderHeaderCell(label: string): JSX.Element {
  return (<th>{label}</th>)
}

function renderDataCell(content: JSX.Element): JSX.Element {
  return (<td>{content}</td>)
}

export const FileResultTable: Component<FileResultTableProps> = (props) => {
  const [selectedGroupRow, setSelectedGroupRow] = createSignalSelectedGroupRow()
  const [selectedGroupRows, setSelectedGroupRows] = createSignalSelectedGroupRows()

  function updateSelectedGroupRow(row: SelectedGroupRow) {
    setSelectedGroupRow(row)
    props.onChangeSelectedGroupRow(row)
  }

  const setRowCheckboxState = (key: string, checked: boolean) => {
    setSelectedGroupRows(previous => {
      const nextSelectedGroupRows = new Set(previous)
      checked ? nextSelectedGroupRows.add(key) : nextSelectedGroupRows.delete(key)
      return nextSelectedGroupRows
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

  // TODO: render naming if returns html?
  // TODO: comment check + naming
  // A no-op renderer avoids introducing conditional logic into row rendering.
  // Checkbox rendering is kept separate from column definitions, as it depends on row indices
  // and relies on imperative logic, which conflicts with the declarative column model.
  let rowCheckboxCellRenderer: (groupI: number, rowI: number) => JSX.Element = (_i: number, _j: number) => null

  if (props.showRowCheckboxes) {
    headerCheckboxCell = renderHeaderCell('')

    rowCheckboxCellRenderer = (groupI, rowI) => {
      const key = `${groupI}:${rowI}`

      return renderDataCell(
        <input
          type="checkbox"
          checked={selectedGroupRows().has(key)}
          onChange={(e) => setRowCheckboxState(key, e.currentTarget.checked)}
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
                      <For each={row.cells}>
                        {(cell, cellIndex) => renderDataCell(cellContentRenderers[cellIndex()](cell))}
                      </For>
                      {rowCheckboxCellRenderer(groupI, rowI)}
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