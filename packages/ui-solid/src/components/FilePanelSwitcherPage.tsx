import { createSignal } from 'solid-js'
import { FilePanelSwitcher } from './FilePanelSwitcher'
import { useToastContext } from '../modules/toasts/toast-context'
import { isRight, right } from '../monads/either'
import type { Component } from 'solid-js'
import type { SourceTargetContextResult } from './FilePathSelectionForm'
import type { FilePathSelectorMode } from './FilePathSelectorGroup'
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

  const context = useToastContext();

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
    if (isRight(result)) {
      executeWithLoading(async () => console.log('result'))
      context.addSuccessToast('') // TODO:
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