import { createSignal } from 'solid-js'
import { FilePanelSwitcher } from './FilePanelSwitcher'
import { FilePathSelectorModes } from './FilePathSelectorGroup'
import { useToastContext } from '../modules/toasts/toast-context'
import { isRight, right } from '../monads/either'
import type { Component } from 'solid-js'
import type { SourceTargetContextResult } from './FilePathSelectionForm'
import type { ResolvedFilePaths } from './FilePathSelectorGroup'
import type { FileResultColumns, FileResultRows, SelectedRows } from './FileResultTable'
import type { SelectFilePath } from '../types/types'

export const DuplicateCleanupPage: Component = () => {
  const [rows, setRows] = createSignal<FileResultRows>([])
  const [isLoading, setIsLoading] = createSignal(false)

  const context = useToastContext();

  const selectFilePath: SelectFilePath = async () => {
    return right('')
  }

  const deleteSelectedFiles = async (selectedRows: SelectedRows): Promise<SelectedRows> => {
    return new Set()
  }

  const findDuplicateFiles =  async (paths: ResolvedFilePaths): Promise<FileResultRows> => {
    return []
  }

  const columns: FileResultColumns = []

  async function executeWithLoading(action: () => Promise<void>): Promise<void> {
    if (isLoading()) return // Ensure the action does not run concurrently

    setIsLoading(true)
    await action()
    setIsLoading(false)
  }

  const handlerSourceTargetContextResult = (result: SourceTargetContextResult) => {
    if (isRight(result)) {
      executeWithLoading(async () => {
        const rows = await findDuplicateFiles(result.value.sourceFilePaths)
        setRows(rows)
        // TODO: 2 rows is 1 duplicate
        context.addSuccessToast(rows.length ? `Found ${rows.length} duplicate files` : 'No duplicates found') // TODO: strings
      })
    } else {
      context.addErrorToast(result.value.message)
    }
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
      filePathSelectorMode={FilePathSelectorModes.regularFileAndDirectory}
      singleSelection={false}
      enableTargetSelection={false}
      canDelete
      isLoading={isLoading()}
      onChangeSelectedRows={handlerSelectedRows}
      onChangeSourceTargetContextResult={handlerSourceTargetContextResult}
      selectFilePath={selectFilePath}
    />
  )
}