import { createSignal } from 'solid-js'
import { FilePathSelectionGroups } from '../../components/FilePathSelectionGroups'
import { FilePathSelectorModes } from '../../components/FilePathSelectorGroup'
import { FileResultInspector } from '../../components/FileResultInspector'
import { FileResultColumnTypes } from '../../components/FileResultTable'
import { createStep, Stepper } from '../../components/Stepper'
import { isArrayEmpty, isLeft, isRight, right, isStrictEqual1 } from 'shared'
import { addErrorToastFromEither, useToastContext } from '../../modules/toasts/toast-context'
import type { Component } from 'solid-js'
import type { InputOutputContextEither } from '../../components/FilePathSelectionGroups'
import type { ResolvedFilePaths } from '../../components/FilePathSelectorGroup'
import type { FileResultColumns, RowGroup, RowGroups, SelectedGroupRows } from '../../components/FileResultTable'
import type { Either, SelectFilePath } from 'shared'

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

// TODO: some functions and similar things inside this component should be outside this component? Other places/components are already ok
export const DuplicateCleanupPage: Component = () => {
  const [rowGroups, setRowGroups] = createSignal<RowGroups>([])
  const [isLoading, setIsLoading] = createSignal(false)

  const context = useToastContext()

  const selectFilePath: SelectFilePath = async () => {
    return right('')
  }

  const deleteSelectedFiles = async (_: SelectedGroupRows): Promise<DeleteSelectedFilesResult> => {
    return new Map()
  }

  const detectDuplicateFiles =  async (_: ResolvedFilePaths): Promise<DetectDuplicateFilesResultEither> => {
    return right({rowGroups: [], duplicateFileCount: 0})
  }

  // const columns: FileResultColumns = []
  const columns: FileResultColumns = [
    {header: 'File Path', type: FileResultColumnTypes.text}, // TODO: 'File Path' good naming?
    {header: 'Preview', type: FileResultColumnTypes.thumbnail} // TODO: 'Preview' good naming?
  ]

  // const groups: RowGroups = [
  //   [{cells: ['C:\\Users\\User\\Documents\\file1.jpg', 'C:\\Users\\User\\Documents\\file1.jpg']}, {cells: ['C:\\Users\\User\\Documents\\file2.jpg', 'C:\\Users\\User\\Documents\\file2.jpg']}],
  //   [{cells: ['C:\\Users\\User\\Documents\\file3.jpg', 'C:\\Users\\User\\Documents\\file3.jpg']}, {cells: ['C:\\Users\\User\\Documents\\file4.jpg', 'C:\\Users\\User\\Documents\\file4.jpg']}],
  // ]

  async function executeWithLoading(action: () => Promise<void>): Promise<void> {
    if (isLoading()) return // Ensure the action does not run concurrently

    setIsLoading(true)
    await action()
    setIsLoading(false)
  }

  const handlerInputOutputContextEither = (either: InputOutputContextEither) => {
    if (isLeft(either)) {
      addErrorToastFromEither(either)
      return
    }

    executeWithLoading(async () => {
      const files = await detectDuplicateFiles(either.value.inputFilePaths)
      if (isRight(files)) {
        setRowGroups(files.value.rowGroups)
        // Stored the duplicate file count in a variable to improve clarity and comply with line length limits
        const count = files.value.duplicateFileCount
        context.addSuccessToast(
          files.value.duplicateFileCount
            ? `${count} duplicate file${isStrictEqual1(count) ? '' : 's'} detected` : 'No duplicate files detected'
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

        for (const [groupIndex, group] of rowGroups().entries()) {
          const rowMap = result.get(groupIndex)
          let nextRows: RowGroup = []

          if (rowMap) {
            for (const [rowIndex, row] of group.entries()) {
              if (!rowMap.has(rowIndex)) {
                nextRows.push(row)
              } else {
                const error = rowMap.get(rowIndex)

                if (error) {
                  errorMessages.push(error.message)
                  nextRows.push(row)
                }
              }
            }
          } else {
            nextRows = group
          }

          if (nextRows.length > 1) {
            groups.push(nextRows)
          }
        }

        setRowGroups(groups)

        if (errorMessages.length > 0) {
          context.addErrorToast(errorMessages.join('\n'))
        }
      }
    )
  }

  return (
    <div class="page">
      <Stepper
        steps={[
          createStep(
            'File Selection',
            'Select Files and Directories',
            'Choose the files and directories you want to include for duplicate checking. Any duplicate file paths or duplicate subpaths will be automatically filtered out.',
            <FilePathSelectionGroups
              filePathSelectorMode={FilePathSelectorModes.regularFileAndDirectory}
              isLoading={isLoading()}
              singleSelection={false}
              enableOutput={false}
              selectFilePath={selectFilePath}
              onChange={handlerInputOutputContextEither}
            />,
            'Add file(s) and/or folder(s) to continue'
          ),
          createStep(
            'File Inspection',
            'File Review and Deletion',
            'Select a file to inspect it in more detail, or choose the files you want to delete. By default, only duplicate files can be deleted; enabling advanced mode allows deletion of any file.',
            <FileResultInspector
              columns={columns}
              rowGroups={rowGroups()}
              isLoading={isLoading()}
              canDelete
              onChange={handlerSelectedGroupRows}
            />,
            'Select one or more files to enable deletion.'
          )
        ]}
        lastEnabledStepIndex={isArrayEmpty(rowGroups()) ? 0 : 1}
        showNavigationControls={false}
      />
    </div>
  )
}