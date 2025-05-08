// TODO: show a toast

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
  const [rows, setRows] = createSignal<FileResultRows>([])
  const [isLoading, setIsLoading] = createSignal(false)

  const selectFilePath: SelectFilePath = async () => {
    return right('')
  }

  const deleteSelectedFiles = async (selectedRows: SelectedRows): Promise<SelectedRows> => {
    return new Set()
  }

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