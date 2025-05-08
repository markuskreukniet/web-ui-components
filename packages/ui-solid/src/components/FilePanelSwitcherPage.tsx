// TODO: show a toast
// TODO: isLoading and disabling buttons. If isLoading, should all the buttons be disabled?

import { createSignal } from 'solid-js'
import { FilePanelSwitcher } from './FilePanelSwitcher'
import { FilePathSelectorMode } from './FilePathSelectorGroup'
import { right } from '../monads/either'
import type { Component } from 'solid-js'
import type { SourceTargetContextResult } from './FilePathSelectionForm'
import type { FileResultColumns, FileResultRows, SelectedRows } from './FileResultTable'
import type { SelectFilePath } from '../types/types'

type FilePanelSwitcherPageProps = {
  filePathSelectorMode: FilePathSelectorMode
  singleSelection: boolean
  enableTargetSelection: boolean
  canDelete: boolean
}

export const FilePanelSwitcherPage: Component<FilePanelSwitcherPageProps> = (props) => {
  const [rows, setRows] = createSignal<FileResultRows>([]) // TODO: should it be a set same for columns?
  const [isLoading, setIsLoading] = createSignal(false)

  const selectFilePath: SelectFilePath = async () => {
    return right('')
  }

  const deleteSelectedFiles = async (selectedRows: SelectedRows): Promise<Set<number>> => {
    return new Set()
  }

  // TODO: What if columns is read after rows? Also, columns do not change?
  const columns: FileResultColumns = []

  async function executeWithLoading(action: () => Promise<void>): Promise<void> {
    if (isLoading()) return // Ensure the action does not run concurrently

    setIsLoading(true)
    await action()
    setIsLoading(false)
  }

  const handlerSourceTargetContextResult = (result: SourceTargetContextResult) => {
    executeWithLoading(async () => console.log('result'))
  }

  const handlerSelectedRows = (selectedRows: SelectedRows) => {
    executeWithLoading(
      async () => {
        const indexes = await deleteSelectedFiles(selectedRows)
        setRows(rows().filter((_, index) => !indexes.has(index)))
      }
    )
  }

  return (
    <FilePanelSwitcher
      columns={columns}
      rows={rows()}
      filePathSelectorMode={props.filePathSelectorMode}
      singleSelection={props.singleSelection}
      enableTargetSelection={props.enableTargetSelection}
      canDelete={props.canDelete}
      isLoading={isLoading()}
      onChangeSelectedRows={handlerSelectedRows}
      onChangeSourceTargetContextResult={handlerSourceTargetContextResult}
      selectFilePath={selectFilePath}
    />
  )
}