import { createSignal, For, Show } from 'solid-js'
import { DeleteFilesButton } from './buttons/DeleteFilesButton'
import { CheckboxInput } from './CheckboxInput'
import { DeleteFilesDialog } from './DeleteFilesDialog'
import { FileResultColumnTypes, FileResultTable } from './FileResultTable'
import { hasMapSingleEntry, hasSetSingleElement } from '../utils/collection-size'
import type { Component, JSX } from 'solid-js'
import type {
  FileResultColumnType,
  FileResultTableDataProps,
  OnChangeSelectedGroupRows,
  SelectedGroupRow,
  SelectedGroupRows
} from './FileResultTable'
import type { IsLoadingProps } from '../types/types'

type FileResultInspectorProps = FileResultTableDataProps & IsLoadingProps & {
  canDelete: boolean
  onChange: OnChangeSelectedGroupRows
}

type CellContentRenderer = (cellData: string) => JSX.Element

const baseCellContentRenderers = {
  [FileResultColumnTypes.thumbnail]: (cellData: string) => <img src={cellData} alt="" />
} satisfies Partial<Record<FileResultColumnType, CellContentRenderer>>

export function extendCellRenderers(
  textCellRenderer: CellContentRenderer
): Record<FileResultColumnType, CellContentRenderer> {
  return {
    ...baseCellContentRenderers,
    [FileResultColumnTypes.text]: textCellRenderer
  }
}

// TODO: should there be a p tag? Td itself is maybe enough, which is maybe also enough for text content previews
const cellContentRenderers = extendCellRenderers(value => <p>{value}</p>)

export const FileResultInspector: Component<FileResultInspectorProps> = props => {
  const [selectedGroupRow, setSelectedGroupRow] = createSignal<SelectedGroupRow>(null)
  const [selectedGroupRows, setSelectedGroupRows] = createSignal<SelectedGroupRows>(new Map())
  const [hasNotSelectedGroupRows, setHasNotSelectedGroupRows] = createSignal<boolean>(true)
  const [allowSelectingAllRows, setAllowSelectingAllRows] = createSignal<boolean>(false)
  const [hasSingleSelectedGroupRow, setHasSingleSelectedGroupRow] = createSignal<boolean>(false)
  const [open, setOpen] = createSignal<boolean>(false)

  const handlerOpen = (open: boolean) => () => setOpen(open)

  const updateSelectedGroupRows = (rows: SelectedGroupRows) => {
    setSelectedGroupRows(rows)
    setHasSingleSelectedGroupRow(hasMapSingleEntry(rows) && hasSetSingleElement(rows.values().next().value!))
  }

  let ref: HTMLLabelElement | undefined

  const drawAttentionToLabel = () => {
    const defined = ref!
    const attention = "attention"
    defined.classList.add(attention)
    defined.addEventListener("animationend", () => defined.classList.remove(attention), { once: true })
  }

  const handlerChange = (checked: boolean) => {
    if (!checked) {
      setSelectedGroupRows(prev => {
        const next = new Map(prev)
        for (const [key, value] of next) {
          if (props.rowGroups[key].length === value.size) {
            value.delete(0)
          }
        }
        return next
      })
    }

    setAllowSelectingAllRows(checked)
  }

  const columnRenderers = props.columns.map(column => cellContentRenderers[column.type])

  return (
    <div class="file-result-inspector">
      <div>
        <FileResultTable
          columns={props.columns}
          rowGroups={props.rowGroups}
          showRowCheckboxes={props.canDelete}
          drawAttentionToLabel={drawAttentionToLabel}
          onChangeSelectedGroupRow={selectedGroupRow}
          onChangeSetSelectedGroupRow={setSelectedGroupRow}
          onChangeSelectedGroupRows={selectedGroupRows}
          onChangeUpdateSelectedGroupRows={updateSelectedGroupRows}
          onChangeHasNotSelectedGroupRows={hasNotSelectedGroupRows}
          onChangeSetHasNotSelectedGroupRows={setHasNotSelectedGroupRows}
          onChangeAllowSelectingAllRows={allowSelectingAllRows}
        />

        <Show when={selectedGroupRow()}>
          {groupRow => {
            return (
              <div class="file-result-inspector__selection">
                <For each={props.rowGroups[groupRow().group][groupRow().row].cells}>
                  {(cell, index) => {
                    const i = index()

                    return (
                      <div>
                        <span>{props.columns[i].header}</span>
                        {columnRenderers[i](cell)}
                      </div>
                    )
                  }}
                </For>
              </div>
            )
          }}
        </Show>
      </div>

      <div class="file-result-inspector__actions">
        <label ref={ref}>
          <CheckboxInput
            checked={allowSelectingAllRows()}
            onChange={handlerChange}
          />
          <span>⚠ Allow deleting non-duplicate files (dangerous)</span>
        </label>

        {props.canDelete && (
          <>
            <DeleteFilesDialog
              open={open()}
              count={selectedGroupRows().size}
              hasSingleSelectedGroupRow={hasSingleSelectedGroupRow()}
              onClose={handlerOpen(false)}
              onConfirm={async () => props.onChange(selectedGroupRows())}
            />

            <DeleteFilesButton
              hasSingleSelectedGroupRow={hasSingleSelectedGroupRow()}
              isLoading={props.isLoading}
              disabled={hasNotSelectedGroupRows()}
              onPress={handlerOpen(true)}
            />
          </>
        )}
      </div>
    </div>
  )
}