import { createSignal } from 'solid-js'
import { FilePanelSwitcher } from '../../components/FilePanelSwitcher'
import { FilePathSelectorModes } from '../../components/FilePathSelectorGroup'
import { isLeft, isRight, right } from '../../modules/monads/either'
import { addErrorToastFromEither, useToastContext } from '../../modules/toasts/toast-context'
import type { Component } from 'solid-js'
import type { SourceTargetContextEither } from '../../components/FilePathSelectionForm'
import type { ResolvedFilePaths } from '../../components/FilePathSelectorGroup'
import type { FileResultColumns, RowGroup, RowGroups, SelectedGroupRows } from '../../components/FileResultTable'
import type { Either } from '../../modules/monads/either'
import type { SelectFilePath } from '../../types/types'

type DetectDuplicateFilesResult = {
  rowGroups: RowGroups,
  duplicateFileCount: number
}

type DetectDuplicateFilesResultEither = Either<Error, DetectDuplicateFilesResult>

type DeleteSelectedFilesResult = Map<number, Map<number, Error | null>>

export const DuplicateCleanupPage: Component = () => {
  const [rowGroups, setRowGroups] = createSignal<RowGroups>([])
  const [isLoading, setIsLoading] = createSignal(false)

  const context = useToastContext()

  const selectFilePath: SelectFilePath = async () => {
    return right('')
  }

  const deleteSelectedFiles = async (selectedGroupRows: SelectedGroupRows): Promise<DeleteSelectedFilesResult> => {
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
      addErrorToastFromEither(either)
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
        addErrorToastFromEither(files)
      }
    })
  }

  // TODO: if too many error in error toast, scrollbar + is efficient?
  const handlerSelectedGroupRows = (selectedGroupRows: SelectedGroupRows) => {
    executeWithLoading(
      async () => {
        const files = await deleteSelectedFiles(selectedGroupRows)

        function hasMoreThanOneRow(group: RowGroup) {
          return group.length > 1
        }

        setRowGroups((current: RowGroups) => {
          const next = [...current]

          for (const [key, value] of files) {
            // !value.get(index) indicates that the row was either unselected (undefined) or successfully deleted (null)
            const group = next[key].filter((_, index) => !value.get(index))
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