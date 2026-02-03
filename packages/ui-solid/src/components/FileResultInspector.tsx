import { createSignal, For, Show } from 'solid-js'
import { DeleteFilesButton } from './buttons/DeleteFilesButton'
import { CheckboxInput } from './CheckboxInput'
import { DeleteFilesDialog } from './DeleteFilesDialog'
import { FileResultColumnTypes, FileResultTable } from './FileResultTable'
import { isStrictEqual1 } from 'shared'
import type { Component, JSX } from 'solid-js'
import type {
  FileResultTableDataProps,
  OnChangeSelectedGroupRows,
  SelectedGroupRow,
  SelectedGroupRows
} from './FileResultTable'
import type { IsLoadingProps } from 'shared'

type FileResultInspectorProps = FileResultTableDataProps & IsLoadingProps & {
  canDelete: boolean
  onChange: OnChangeSelectedGroupRows
}

export type Renderer = (value: string) => JSX.Element

export type Renderers = Renderer[]

export const FileResultInspector: Component<FileResultInspectorProps> = props => {
  const [selectedGroupRow, setSelectedGroupRow] = createSignal<SelectedGroupRow>(null)
  const [selectedGroupRows, setSelectedGroupRows] = createSignal<SelectedGroupRows>(new Map())
  const [hasNotSelectedGroupRows, setHasNotSelectedGroupRows] = createSignal<boolean>(true)
  const [allowSelectingAllRows, setAllowSelectingAllRows] = createSignal<boolean>(false)
  const [hasSingleSelectedGroupRow, setHasSingleSelectedGroupRow] = createSignal<boolean>(false)
  const [count, setCount] = createSignal<number>(0)
  const [open, setOpen] = createSignal<boolean>(false)

  const cloneSelectedGroupRows = () => {
    return new Map(selectedGroupRows())
  }

  const createColumnRenderers = (renderer: Renderer): Renderers => {
    return props.columns.map(column => {
      switch (column.type) {
        case FileResultColumnTypes.thumbnail:
          return (value: string) => <img src={value} alt="" />
        case FileResultColumnTypes.text:
          return renderer
      }
    })
  }

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
      const next = cloneSelectedGroupRows()
      for (const [key, value] of next) {
        if (props.rowGroups[key].length === value.size) {
          value.delete(0)
        }
      }
      updateSelectedGroupRows(next)
    }

    setAllowSelectingAllRows(checked)
  }

  const renderers = createColumnRenderers(value => <span>{value}</span>)

  return (
    <div class="file-result-inspector">
      <div>
        <FileResultTable
          columns={props.columns}
          rowGroups={props.rowGroups}
          showRowCheckboxes={props.canDelete}
          drawAttentionToLabel={drawAttentionToLabel}
          createColumnRenderers={createColumnRenderers}
          cloneSelectedGroupRows={cloneSelectedGroupRows}
          selectedGroupRow={selectedGroupRow}
          setSelectedGroupRow={setSelectedGroupRow}
          selectedGroupRows={selectedGroupRows}
          updateSelectedGroupRows={updateSelectedGroupRows}
          hasNotSelectedGroupRows={hasNotSelectedGroupRows}
          setHasNotSelectedGroupRows={setHasNotSelectedGroupRows}
          allowSelectingAllRows={allowSelectingAllRows}
        />

        <div class="file-result-inspector__selection">
          <Show when={selectedGroupRow()}>
            {groupRow => {
              return (
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
              )
            }}
          </Show>
        </div>
      </div>

      <div class="file-result-inspector__actions">
        <label ref={ref}>
          <CheckboxInput
            checked={allowSelectingAllRows()}
            onChange={handlerChange}
          />
          <span>⚠ Allow deletion of non-duplicate files (advanced — use with caution)</span>
        </label>

        {props.canDelete && (
          <>
            <DeleteFilesDialog
              open={open()}
              count={count()}
              hasSingleSelectedGroupRow={hasSingleSelectedGroupRow()}
              isDestructive={allowSelectingAllRows()}
              onClose={handlerOpen(false)}
              onConfirm={async () => props.onChange(selectedGroupRows())}
            />

            <DeleteFilesButton
              hasSingleSelectedGroupRow={hasSingleSelectedGroupRow()}
              isDestructive={allowSelectingAllRows()}
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