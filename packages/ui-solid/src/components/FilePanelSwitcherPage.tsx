// TODO:
// deleteSelectedFiles: (rows: SelectedRows) => Promise<Set<number>> // TODO: rows naming? // TODO: is the result either good? the result should be used to show a toast

// const [rows, setRows] = createSignal<FileResultRow[]>(props.rows)
// const [disabled, setDisabled] = createSignal(false);

import { FilePanelSwitcher } from './FilePanelSwitcher'
import { FilePathSelectorMode } from './FilePathSelectorGroup'
import { right } from '../monads/either'
import type { Component } from 'solid-js'
import type { SourceTargetContextResult } from './FilePathSelectionForm'
import type { FileResultColumn, FileResultRow, SelectedRows } from './FileResultTable'
import type { SelectFilePath } from '../types/types'

type FilePanelSwitcherPageProps = {
  filePathSelectorMode: FilePathSelectorMode
  singleSelection: boolean
  enableTargetSelection: boolean
  canDelete: boolean
}

export const FilePanelSwitcherPage: Component<FilePanelSwitcherPageProps> = (props) => {
  const selectFilePath: SelectFilePath = async () => {
    return right('')
  }

  const rows: FileResultRow[] = [] // TODO: possible to make FileResultRows type of array?
  const columns: FileResultColumn[] = [] // TODO: possible to make FileResultColumn type of array?
  let isLoading: boolean = false

  // TODO: multiple naming. withLoadingGuard is good
  async function withLoadingGuard<T>(fn: (arg: T) => void, arg: T): Promise<void> {
    if (isLoading) return; // Prevent concurrent execution // TODO: comment

    isLoading = true;
    fn(arg);
    isLoading = false;

    //   const indexes = await props.deleteSelectedFiles(selectedRows()) // TODO: a parent should call this function, same for showing a toast
    //   setRows(rows().filter((_, index) => !indexes.has(index)))
  }

  const handlerSourceTargetContextResult = (result: SourceTargetContextResult) => {
    withLoadingGuard((res) => console.log('result', res), result);
  };

  const handlerSelectedRows = (rows: SelectedRows) => {
    withLoadingGuard((r) => console.log('rows', r), rows);
  };

  return (
    <FilePanelSwitcher
      columns={columns}
      rows={rows}
      filePathSelectorMode={props.filePathSelectorMode}
      singleSelection={props.singleSelection}
      enableTargetSelection={props.enableTargetSelection}
      canDelete={props.canDelete}
      isLoading={isLoading}
      onChangeSelectedRows={handlerSelectedRows}
      onChangeSourceTargetContextResult={handlerSourceTargetContextResult}
      selectFilePath={selectFilePath}
    />
  )
}