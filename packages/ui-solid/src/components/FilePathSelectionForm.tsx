import { createSignal, For, Show } from 'solid-js'
import { Button } from './Button'
import { FilePathEntrySelector } from './FilePathEntrySelector'
import { SubmitButton } from './SubmitButton'
import type { Component } from 'solid-js'
import type { Either } from '../monads/either'
import type { FilePathEntry, FilePathEntryResult, FilePathType } from './FilePathEntrySelector'

// TODO: add enums for both Show. Also for button variant. Also () => Promise<Either<Error, string>> type

type FilePathSelectorMode = FilePathType | 'regularFileAndDirectory';

type FilePathSelectionFormProps = {
  filePathSelectorMode: FilePathSelectorMode
  selectFilePath: () => Promise<Either<Error, string>>
}

export const FilePathSelectionForm: Component<FilePathSelectionFormProps> = (props) => {
  const [filePathEntries, setFilePathEntries] = createSignal<FilePathEntry[]>([]);

  function showFilePathEntrySelector(mode: FilePathSelectorMode) {
    return (props.filePathSelectorMode === mode || props.filePathSelectorMode === 'regularFileAndDirectory')
  }

  const handleChange = (result: FilePathEntryResult) => {

  }

  const handlePress = () => {

  }

  return (
    <div>
      <div>
        <Show when={showFilePathEntrySelector('regularFile')}>
          <FilePathEntrySelector
            filePathType={'regularFile'}
            selectFilePath={props.selectFilePath}
            onChange={handleChange}
          />
        </Show>
        <Show when={showFilePathEntrySelector('directory')}>
          <FilePathEntrySelector
            filePathType={'directory'}
            selectFilePath={props.selectFilePath}
            onChange={handleChange}
          />
        </Show>
      </div>
      <ul>
        <For each={filePathEntries()}>
          {(entry) => <li>{entry.filePath}</li>}
        </For>
      </ul>
      <div>
        <Button
          disabled={false}
          onPress={handlePress}
          text={'reset'}
          variant={'tertiary'}
        />
        <SubmitButton
          disabled={false}
          onPress={handlePress}
        />
      </div>
    </div>
  )
}