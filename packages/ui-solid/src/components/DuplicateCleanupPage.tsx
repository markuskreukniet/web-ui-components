import { createSignal } from 'solid-js'
import { FilePanelSwitcher } from './FilePanelSwitcher'
import { FilePathSelectorModes } from './FilePathSelectorGroup'
import { useToastContext } from '../modules/toasts/toast-context'
import { isLeft, isRight, right } from '../monads/either'
import type { Component } from 'solid-js'
import type { SourceTargetContextEither } from './FilePathSelectionForm'
import type { ResolvedFilePaths } from './FilePathSelectorGroup'
import type { FileResultColumns, RowGroup, RowGroups, SelectedGroupRows } from './FileResultTable'
import type { Either } from '../monads/either'
import type { SelectFilePath } from '../types/types'

// TODO: add to README. If function returns a unique result, then name the result of of the function the as the function with the Result postfix
// TODO: also add line length rule to README
type DetectDuplicateFilesResult = {
  rowGroups: RowGroups,
  duplicateFileCount: number
}

type DetectDuplicateFilesResultEither = Either<Error, DetectDuplicateFilesResult>

export const DuplicateCleanupPage: Component = () => {
  const [rowGroups, setRowGroups] = createSignal<RowGroups>([])
  const [isLoading, setIsLoading] = createSignal(false)

  const context = useToastContext()

  const selectFilePath: SelectFilePath = async () => {
    return right('')
  }

  // TODO: should it be an either for each removed row?
  const deleteSelectedFiles = async (selectedGroupRows: SelectedGroupRows): Promise<SelectedGroupRows> => {
    return new Map()
  }

  const detectDuplicateFiles =  async (paths: ResolvedFilePaths): Promise<DetectDuplicateFilesResultEither> => {
    return right({rowGroups: [], duplicateFileCount: 0})
  }

  const columns: FileResultColumns = []

  async function executeWithLoading(action: () => Promise<void>): Promise<void> {
    if (isLoading()) return // Ensure the action does not run concurrently

    setIsLoading(true)
    await action()
    setIsLoading(false)
  }

  const handlerSourceTargetContextEither = (either: SourceTargetContextEither) => {
    if (isLeft(either)) {
      context.addErrorToast(either.value.message)
      return
    }

    executeWithLoading(async () => {
      const files = await detectDuplicateFiles(either.value.sourceFilePaths)
      if (isRight(files)) {
        setRowGroups(files.value.rowGroups)
        // Stored the duplicate file count in a variable to improve clarity and comply with line length limits
        const count = files.value.duplicateFileCount
        context.addSuccessToast(
          files.value.duplicateFileCount
            ? `${count} duplicate file${count === 1 ? '' : 's'} detected` : 'No duplicate files detected'
        )
      } else {
        context.addErrorToast(files.value.message) // TODO: duplicate
      }
    })
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