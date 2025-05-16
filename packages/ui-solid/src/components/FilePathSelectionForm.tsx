import { createSignal, For, Show } from 'solid-js'
import { Button } from './Button'
import { isRight } from '../monads/either'
import { FilePathSelector } from './FilePathSelector'
import { SubmitButton } from './SubmitButton'
import type { Component } from 'solid-js'
import type { Either } from '../monads/either'
import type { FilePathType, SelectedFilePathResult } from './FilePathSelector'

// TODO: add enums for both Show. Also for button variant. Also () => Promise<Either<Error, string | null>> type

export type ResolvedFilePath = {
  filePath: string
  isDirectory: boolean
};

type FilePathSelectorMode = FilePathType | 'regularFileAndDirectory';

type FilePathSelectionFormProps = {
  filePathSelectorMode: FilePathSelectorMode
  selectFilePath: () => Promise<Either<Error, string | null>>
  singleSelection: boolean
}

export const FilePathSelectionForm: Component<FilePathSelectionFormProps> = (props) => {
  const [resolvedFilePaths, setResolvedFilePaths] = createSignal<ResolvedFilePath[]>([]);

  function showFilePathSelector(mode: FilePathSelectorMode) {
    return (props.filePathSelectorMode === mode || props.filePathSelectorMode === 'regularFileAndDirectory')
  }

  function createResolvedFilePath(filePath: string, isDirectory: boolean): ResolvedFilePath {
    return {
      filePath,
      isDirectory
    }
  }

  // Add a trailing slash to a file path.
  // Without the trailing slash, /path/sub is a parent of /path/subpath.
  // This trailing slash method should also work on non-Windows systems.
  function addTrailingSlash(filePath: string) {
    const forwardSlash = '/'
    return filePath.startsWith(forwardSlash) ? filePath + forwardSlash : filePath + '\\'
  }

  const handleChange = (result: SelectedFilePathResult) => {
    if (isRight(result) && result.value.filePath !== null) {
      if (props.singleSelection) {
        setResolvedFilePaths([createResolvedFilePath(result.value.filePath, result.value.isDirectory)])
      } else {
        const filteredPaths: ResolvedFilePath[] = [];
        const newPathWithSlash = addTrailingSlash(result.value.filePath)
        let shouldReplace = true
        for (const path of resolvedFilePaths()) {
          const pathWithSlash = addTrailingSlash(path.filePath)
          if (newPathWithSlash === pathWithSlash || newPathWithSlash.startsWith(pathWithSlash)) {
            shouldReplace = false
            break
          }
          if (!pathWithSlash.startsWith(newPathWithSlash)) {
            filteredPaths.push(path)
          }
        }
        if (shouldReplace) {
          setResolvedFilePaths([
            ...filteredPaths,
            createResolvedFilePath(result.value.filePath, result.value.isDirectory)
          ])
        }
      }
    }
  }

  const handlePress = () => {

  }

  return (
    <div>
      <div>
        <Show when={showFilePathSelector('regularFile')}>
          <FilePathSelector
            filePathType={'regularFile'}
            selectFilePath={props.selectFilePath}
            onChange={handleChange}
          />
        </Show>
        <Show when={showFilePathSelector('directory')}>
          <FilePathSelector
            filePathType={'directory'}
            selectFilePath={props.selectFilePath}
            onChange={handleChange}
          />
        </Show>
      </div>
      <ul>
        <For each={resolvedFilePaths()}>
          {(path) => <li>{path.filePath}</li>}
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