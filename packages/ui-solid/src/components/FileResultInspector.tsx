import { createSignal, For, Show } from 'solid-js'
import { DeleteFilesButton } from './buttons/DeleteFilesButton'
import { CheckboxInput } from './CheckboxInput'
import { DeleteFilesDialog } from './DeleteFilesDialog'
import { FileResultColumnTypes, FileResultTable } from './FileResultTable'
import { isStrictEqual1 } from '../utils/utils'
import type { Component, JSX } from 'solid-js'
import type {
  FileResultColumns,
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

// TODO: place inside FileResultInspector so that columns: FileResultColumns is not needed?
export function createColumnRenderers(columns: FileResultColumns, renderer: (value: string) => JSX.Element) {
  return columns.map(column =>
    ({
      [FileResultColumnTypes.thumbnail]: (value: string) => <img src={value} alt="" />,
      [FileResultColumnTypes.text]: renderer
    }[column.type])
  )
}

export const FileResultInspector: Component<FileResultInspectorProps> = props => {
  const [selectedGroupRow, setSelectedGroupRow] = createSignal<SelectedGroupRow>(null)
  const [selectedGroupRows, setSelectedGroupRows] = createSignal<SelectedGroupRows>(new Map())
  const [hasNotSelectedGroupRows, setHasNotSelectedGroupRows] = createSignal<boolean>(true)
  const [allowSelectingAllRows, setAllowSelectingAllRows] = createSignal<boolean>(false)
  const [hasSingleSelectedGroupRow, setHasSingleSelectedGroupRow] = createSignal<boolean>(false)
  const [count, setCount] = createSignal<number>(0)
  const [open, setOpen] = createSignal<boolean>(false)

  const handlerOpen = (open: boolean) => () => setOpen(open)

  const updateSelectedGroupRows = (rows: SelectedGroupRows) => {
    let count = 0
    for (const value of rows.values()) {
      count += value.size
    }

    setSelectedGroupRows(rows)
    setHasSingleSelectedGroupRow(isStrictEqual1(count))
    setCount(count)
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
      const next = new Map(selectedGroupRows()) // TODO: duplicate code?
      for (const [key, value] of next) {
        if (props.rowGroups[key].length === value.size) {
          value.delete(0)
        }
      }
      updateSelectedGroupRows(next)
    }

    setAllowSelectingAllRows(checked)
  }

  const renderers = createColumnRenderers(props.columns, value => <span>{value}</span>)

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
                        {renderers[i](cell)}
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
              count={count()}
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