import { createSignal } from 'solid-js'
import { FilePanelSwitcher } from '../../components/FilePanelSwitcher'
import { FilePathSelectorModes } from '../../components/FilePathSelectorGroup'
import { FileResultColumnTypes } from '../../components/FileResultTable'
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

// A mapping from group indices to row indices,
// where each inner map captures the deletion status of individual rows within a group.
// Each row index maps to `null` for a successful deletion, or to an `Error` if deletion failed.
// This unified structure eliminates the redundancy of maintaining separate maps for deleted and retained rows,
// ensuring each group index is represented only once.
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

  // const columns: FileResultColumns = []
  const columns: FileResultColumns = [
    {header: 'File Path', type: FileResultColumnTypes.text}, // TODO: 'File Path' good naming?
    {header: 'Preview', type: FileResultColumnTypes.thumbnail} // TODO: 'Preview' good naming?
  ]

  // const groups: RowGroups = [
  //   [{cells: ['dir/dir2/file.jpg', 'dir/dir2/file.jpg']}, {cells: ['dir/dir2/file2.jpg', 'dir/dir2/file2.jpg']}],
  //   [{cells: ['dir2/dir3/file3.jpg', 'dir2/dir3/file4.jpg']}, {cells: ['dir2/dir3/file3.jpg', 'dir2/dir3/file4.jpg']}]
  // ]

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

  const handlerSelectedGroupRows = (selectedGroupRows: SelectedGroupRows) => {
    executeWithLoading(
      async () => {
        const result = await deleteSelectedFiles(selectedGroupRows)

        const groups: RowGroups = []
        const errorMessages: string[] = []

        rowGroups().forEach((group, groupIndex) => {
          const rowMap = result.get(groupIndex)
          let nextRows: RowGroup = []

          if (rowMap) {
            group.forEach((row, rowIndex) => {
              if (!rowMap.has(rowIndex)) {
                nextRows.push(row)
              } else {
                const error = rowMap.get(rowIndex)

                if (error) {
                  errorMessages.push(error.message)
                  nextRows.push(row)
                }
              }
            })
          } else {
            nextRows = group
          }

          if (nextRows.length > 1) {
            groups.push(nextRows)
          }
        })

        setRowGroups(groups)

        if (errorMessages.length > 0) {
          context.addErrorToast(errorMessages.join('\n'))
        }
      }
    )
  }

  return (
    <div class="page">
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
    </div>
  )
}