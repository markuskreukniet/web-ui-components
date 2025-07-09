import { createSignal } from 'solid-js'
import { FilePanelSwitcher } from './FilePanelSwitcher'
import { FilePathSelectorModes } from './FilePathSelectorGroup'
import { useToastContext } from '../modules/toasts/toast-context'
import { isRight, right } from '../monads/either'
import type { Component } from 'solid-js'
import type { SourceTargetContextEither } from './FilePathSelectionForm'
import type { ResolvedFilePaths } from './FilePathSelectorGroup'
import type { FileResultColumns, FileResultRows, SelectedRows } from './FileResultTable'
// import { isRight, right, type Either } from '../monads/either' TODO: is this style of import better?
import type { Either } from '../monads/either'
import type { SelectFilePath } from '../types/types'

// TODO: naming + move to types file
type DuplicateScanResult = {
  rows: FileResultRows,
  numberOfDuplicates: number // TODO: naming
}

// TODO: naming + move to types file
type DuplicateScanResultEither = Either<Error, DuplicateScanResult>

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

  // TODO: naming
  const detectDuplicateFiles =  async (paths: ResolvedFilePaths): Promise<DuplicateScanResult> => {
    return {rows: [], numberOfDuplicates: 0}
  }

  const columns: FileResultColumns = []

  async function executeWithLoading(action: () => Promise<void>): Promise<void> {
    if (isLoading()) return // Ensure the action does not run concurrently

    setIsLoading(true)
    await action()
    setIsLoading(false)
  }

  const handlerSourceTargetContextEither = (either: SourceTargetContextEither) => {
    if (isRight(either)) {
      executeWithLoading(async () => {
        const files = await detectDuplicateFiles(either.value.sourceFilePaths)
        setRows(files.rows)
        // TODO: 2 rows is 1 duplicate + grouping rows in duplicate sections
        context.addSuccessToast(files.numberOfDuplicates ? `Found ${files.numberOfDuplicates} duplicate files` : 'No duplicates found') // TODO: strings + line size
      })
    } else {
      context.addErrorToast(either.value.message)
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
      onChangeSourceTargetContextEither={handlerSourceTargetContextEither}
      selectFilePath={selectFilePath}
    />
  )
}