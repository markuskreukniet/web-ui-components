import { For } from 'solid-js'
import { CheckboxInput } from './CheckboxInput'
import { TertiaryIconButton } from './buttons/iconButtons/TertiaryIconButton'
import { isMapEmpty } from '../utils/collection-size'
import type { Accessor, Component, JSX, Setter } from 'solid-js'
import type { Renderer, Renderers } from "./FileResultInspector"
import type { VoidFunction } from "../types/types"

export const FileResultColumnTypes = {
  text: 'text',
  thumbnail: 'thumbnail'
} as const

type FileResultColumnType = typeof FileResultColumnTypes[keyof typeof FileResultColumnTypes]

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
  drawAttentionToLabel: VoidFunction
  createColumnRenderers: (renderer: Renderer) => Renderers
  cloneSelectedGroupRows: () => SelectedGroupRows
  selectedGroupRow: Accessor<SelectedGroupRow>
  onChangeSetSelectedGroupRow: Setter<SelectedGroupRow>
  onChangeSelectedGroupRows: Accessor<SelectedGroupRows>
  updateSelectedGroupRows: (rows: SelectedGroupRows) => void
  hasNotSelectedGroupRows: Accessor<boolean>
  onChangeSetHasNotSelectedGroupRows: Setter<boolean>
  allowSelectingAllRows: Accessor<boolean>
}

export const FileResultTable: Component<FileResultTableProps> = props => {
  const setRowCheckboxState = (groupI: number, rowI: number, checked: boolean) => {
    const next = props.cloneSelectedGroupRows()
    const rows = next.has(groupI) ? next.get(groupI)! : new Set<number>()

    function setGroupRows() {
      next.set(groupI, rows)
    }

    function addGroupRow() {
      rows.add(rowI)
      setGroupRows()
    }

    function updateSelectedGroupRows() {
      props.updateSelectedGroupRows(next)
    }

    if (rows.size) {
      if (checked) {
        if (rows.size === props.rowGroups[groupI].length - 1 && !props.allowSelectingAllRows()) {
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

    if (props.selectedGroupRow()) {
      props.onChangeSetSelectedGroupRow(null)
    }
  }

  const handlerCheckboxes = () => {
    props.updateSelectedGroupRows(new Map())
    props.onChangeSetHasNotSelectedGroupRows(true)
  }

  const handlerRow = (groupI: number, rowI: number) => {
    if (props.hasNotSelectedGroupRows()) {
      const row = props.selectedGroupRow()
      props.onChangeSetSelectedGroupRow(
        (!row || (row.group !== groupI || row.row !== rowI)) ? { group: groupI, row: rowI } : null
      )
    }
  }

  const renderers = props.createColumnRenderers(value => value)

  let headerCheckboxCell: JSX.Element = null

  // A no-op renderer avoids conditional logic in the row rendering loop.
  // Checkbox rendering is kept separate from the column model, as it depends on row indices
  // and imperative updates that violate the declarative rendering model.
  let renderCheckbox: (_i: number, _j: number) => JSX.Element = (_i: number, _j: number) => null

  if (props.showRowCheckboxes) {
    headerCheckboxCell = (
      <th>
        <TertiaryIconButton
          disabled={props.hasNotSelectedGroupRows()}
          onPress={() => handlerCheckboxes()}
        >
          <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </TertiaryIconButton>
      </th>
    )

    // TODO: rename it to checkboxRenderer? Also on other places
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
                            props.selectedGroupRow()?.group === groupI &&
                            props.selectedGroupRow()?.row === rowI
                        }}
                      >
                        {renderCheckbox(groupI, rowI)}
                        <For each={row.cells}>
                          {(cell, cellIndex) => <td>{renderers[cellIndex()](cell)}</td>}
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