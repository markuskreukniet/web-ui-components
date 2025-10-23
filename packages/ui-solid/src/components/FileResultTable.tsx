import { For } from 'solid-js'
import { CheckboxInput } from './CheckboxInput'
import { extendCellRenderers } from './FileResultInspector'
import { TertiaryIconButton } from './buttons/iconButtons/TertiaryIconButton'
import { isMapEmpty } from '../utils/collection-size'
import type { Accessor, Component, JSX, Setter } from 'solid-js'

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

export type SelectedGroupRow = GroupRow | null

// Maps group indices to sets of selected row indices, used consistently for input and output.
export type SelectedGroupRows = Map<number, Set<number>>

export type OnChangeSelectedGroupRows = (rows: SelectedGroupRows) => void

export type FileResultTableDataProps = {
  columns: FileResultColumns
  rowGroups: RowGroups
}

type FileResultTableProps = FileResultTableDataProps & {
  showRowCheckboxes: boolean
  drawAttentionToLabel: () => void
  onChangeSelectedGroupRow: Accessor<SelectedGroupRow>
  onChangeSetSelectedGroupRow: Setter<SelectedGroupRow>
  onChangeSelectedGroupRows: Accessor<SelectedGroupRows>
  onChangeSetSelectedGroupRows: Setter<SelectedGroupRows>
  onChangeHasNotSelectedGroupRows: Accessor<boolean>
  onChangeSetHasNotSelectedGroupRows: Setter<boolean>
  onChangeAllowSelectingAllRows: Accessor<boolean>
}

export const FileResultTable: Component<FileResultTableProps> = props => {
  // Do not invoke extendCellRenderers at module scope, as it runs immediately during module initialization.
  // This led to a runtime error when an internal dependency was accessed before it was declared.
  // Move the call inside FileResultTable to defer execution until render time,
  // ensuring all dependencies are safely initialized.
  const fileResultCellContentRenderers = extendCellRenderers(cellData => cellData) // TODO: naming and working makes sense?

  const setRowCheckboxState = (groupI: number, rowI: number, checked: boolean) => {
    const next = new Map(props.onChangeSelectedGroupRows())
    const rows = next.has(groupI) ? next.get(groupI)! : new Set<number>()

    function setGroupRows() {
      next.set(groupI, rows)
    }

    function addGroupRow() {
      rows.add(rowI)
      setGroupRows()
    }

    function updateSelectedGroupRows() {
      props.onChangeSetSelectedGroupRows(next)
    }

    if (rows.size) {
      if (checked) {
        if (rows.size === props.rowGroups[groupI].length - 1 && !props.onChangeAllowSelectingAllRows()) {
          props.drawAttentionToLabel()
          updateSelectedGroupRows()
          return
        } else {
          addGroupRow()
        }
      } else {
        rows.delete(rowI)
        if (rows.size) {
          setGroupRows()
        } else {
          next.delete(groupI)
        }
      }
    } else {
      addGroupRow()
    }

    updateSelectedGroupRows()
    props.onChangeSetHasNotSelectedGroupRows(isMapEmpty(props.onChangeSelectedGroupRows()))

    if (props.onChangeSelectedGroupRow()) {
      props.onChangeSetSelectedGroupRow(null)
    }
  }

  const handlerCheckboxes = () => {
    props.onChangeSetSelectedGroupRows(new Map())
    props.onChangeSetHasNotSelectedGroupRows(true)
  }

  const handlerRow = (groupI: number, rowI: number) => {
    if (props.onChangeHasNotSelectedGroupRows()) {
      const row = props.onChangeSelectedGroupRow()
      props.onChangeSetSelectedGroupRow(
        (!row || (row.group !== groupI || row.row !== rowI)) ? { group: groupI, row: rowI } : null
      )
    }
  }

  const cellContentRenderers = props.columns.map(column => fileResultCellContentRenderers[column.type]) // TODO: naming

  let headerCheckboxCell: JSX.Element = null

  // A no-op renderer avoids conditional logic in the row rendering loop.
  // Checkbox rendering is kept separate from the column model, as it depends on row indices
  // and imperative updates that violate the declarative rendering model.
  let renderCheckbox: (_i: number, _j: number) => JSX.Element = (_i: number, _j: number) => null

  if (props.showRowCheckboxes) {
    headerCheckboxCell = (
      <th>
        <TertiaryIconButton
          disabled={props.onChangeHasNotSelectedGroupRows()}
          onPress={() => handlerCheckboxes()}
        >
          <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </TertiaryIconButton>
      </th>
    )

    renderCheckbox = (groupI, rowI) => {
      // Prevent the checkbox click from bubbling to the row’s onMouseDown.
      // Otherwise, it would also select the row, leading to an unintended row toggle alongside the checkbox change.
      return (
        <td>
          <CheckboxInput
            checked={props.onChangeSelectedGroupRows().get(groupI)?.has(rowI) ?? false}
            onChange={checked => setRowCheckboxState(groupI, rowI, checked)}
            onMouseDownStopPropagation
          />
        </td>
      )
    }
  }

  return (
    <div class="file-result-table">
      <table>
        <thead>
          <tr>
            {headerCheckboxCell}
            <For each={props.columns}>
              {column => <th>{column.header}</th>}
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

                    return (
                      <tr
                        onMouseDown={() => handlerRow(groupI, rowI)}
                        classList={{
                          'file-result-table__selected-row':
                            props.onChangeSelectedGroupRow()?.group === groupI &&
                            props.onChangeSelectedGroupRow()?.row === rowI
                        }}
                      >
                        {renderCheckbox(groupI, rowI)}
                        <For each={row.cells}>
                          {(cell, cellIndex) => <td>{cellContentRenderers[cellIndex()](cell)}</td>}
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
    </div>
  )
}