import { createSignal } from 'solid-js'
import { FilePanelSwitcher } from './FilePanelSwitcher'
import { FilePathSelectorModes } from './FilePathSelectorGroup'
import { useToastContext } from '../modules/toasts/toast-context'
import { isRight, right } from '../monads/either'
import type { Component } from 'solid-js'
import type { SourceTargetContextEither } from './FilePathSelectionForm'
import type { ResolvedFilePaths } from './FilePathSelectorGroup'
import type { FileResultColumns, RowGroup, RowGroups, SelectedGroupRows } from './FileResultTable'
import type { Either } from '../monads/either'
import type { SelectFilePath } from '../types/types'

// TODO: add to README. If function returns a unique result, then name the result of of the function the as the function with the Result postfix
type DetectDuplicateFilesResult = {
  rowGroups: RowGroups,
  duplicateFileCount: number
}

// TODO: useful type? or should it be an either for each removed row?
type DetectDuplicateFilesResultEither = Either<Error, DetectDuplicateFilesResult>

export const DuplicateCleanupPage: Component = () => {
  const [rowGroups, setRowGroups] = createSignal<RowGroups>([])
  const [isLoading, setIsLoading] = createSignal(false)

  const context = useToastContext()

  const selectFilePath: SelectFilePath = async () => {
    return right('')
  }

  const deleteSelectedFiles = async (selectedGroupRows: SelectedGroupRows): Promise<SelectedGroupRows> => {
    return new Map()
  }

  const detectDuplicateFiles =  async (paths: ResolvedFilePaths): Promise<DetectDuplicateFilesResult> => {
    return {rowGroups: [], duplicateFileCount: 0}
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
        setRowGroups(files.rowGroups)
        context.addSuccessToast(
          files.duplicateFileCount
            ? `${files.duplicateFileCount} duplicate file${files.duplicateFileCount === 1 ? '' : 's'} detected`
            : 'No duplicate files detected'
        )
      })
    } else {
      context.addErrorToast(either.value.message)
    }
  }

  const handlerSelectedGroupRows = (selectedGroupRows: SelectedGroupRows) => {
    executeWithLoading(
      async () => {
        const files = await deleteSelectedFiles(selectedGroupRows)

        // TODO: should be toggle to make it possible to remove all rows?
        function hasMoreThanOneRow(group: RowGroup) {
          return group.length > 1
        }

        setRowGroups((current: RowGroups) => {
          const next = [...current]

          for (const [key, value] of files) {
            const group = next[key].filter((_, index) => !value.has(index))
            if (hasMoreThanOneRow(group)) {
              next[key] = group
            }
          }

          return next.filter(group => hasMoreThanOneRow(group))
        })
      }
    )
  }

  return (
    <FilePanelSwitcher
      columns={columns}
      rowGroups={rowGroups()}
      filePathSelectorMode={FilePathSelectorModes.regularFileAndDirectory}
      singleSelection={false}
      enableTargetSelection={false}
      canDelete
      isLoading={isLoading()}
      onChangeSelectedGroupRows={handlerSelectedGroupRows}
      onChangeSourceTargetContextEither={handlerSourceTargetContextEither}
      selectFilePath={selectFilePath}
    />
  )
}