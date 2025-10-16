import { createSignal, For, Show } from 'solid-js'
import { DeleteButton, DeleteButtonVariants } from './buttons/DeleteButton'
import { CheckboxInput } from './CheckboxInput'
import { FileResultColumnTypes, FileResultTable } from './FileResultTable'
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

  let ref: HTMLLabelElement | undefined

  const drawAttentionToLabel = () => {
    const defined = ref!
    const attention = "attention"
    defined.classList.add(attention)
    //defined.addEventListener("animationend", () => defined.classList.remove(attention), { once: true })
  }

  const handlerChange = (checked: boolean) => {
    if (!checked) {
      setSelectedGroupRows(prev => {
        const next = new Map(prev)
        next.forEach((value, key) => {
          if (props.rowGroups[key].length === value.size) {
            value.delete(0)
          }
        })
        return next
      })
    }

    setAllowSelectingAllRows(checked)
  }

  const handlerPress = async () => {
    props.onChange(selectedGroupRows())
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
          onChangeSetSelectedGroupRows={setSelectedGroupRows}
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
          <DeleteButton
            isLoading={props.isLoading}
            disabled={hasNotSelectedGroupRows()}
            onPress={handlerPress}
            variant={DeleteButtonVariants.selection}
          />
        )}
      </div>
    </div>
  )
}