import { createSignal, For, Show } from 'solid-js'
import { DeleteButton, DeleteButtonVariants } from './buttons/DeleteButton'
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

export type CanDeleteProps = {
  canDelete: boolean
}

type FileResultInspectorProps = FileResultTableDataProps & CanDeleteProps & IsLoadingProps & {
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

  const handler = async () => {
    props.onChange(selectedGroupRows())
  }

  const columnRenderers = props.columns.map(column => cellContentRenderers[column.type])

  return (
    <div class="file-result-inspector">
      {props.canDelete && (
        <DeleteButton
          isLoading={props.isLoading}
          disabled={hasNotSelectedGroupRows()}
          onPress={handler}
          variant={DeleteButtonVariants.selection}
        />
      )}

      <div>
        <FileResultTable
          columns={props.columns}
          rowGroups={props.rowGroups}
          showRowCheckboxes={props.canDelete}
          onChangeSelectedGroupRow={selectedGroupRow}
          onChangeSetSelectedGroupRow={setSelectedGroupRow}
          onChangeSelectedGroupRows={selectedGroupRows}
          onChangeSetSelectedGroupRows={setSelectedGroupRows}
          onChangeHasNotSelectedGroupRows={hasNotSelectedGroupRows}
          onChangeSetHasNotSelectedGroupRows={setHasNotSelectedGroupRows}
        />

        <Show when={selectedGroupRow()}>
          {groupRow => {
            return (
              <div>
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
    </div>
  )
}