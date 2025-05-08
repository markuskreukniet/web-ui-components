import { createSignal, For, Show } from 'solid-js'
import { Button } from './Button'
import { isRight, left, right } from '../monads/either'
import { FilePathSelector, FilePathType } from './FilePathSelector'
import type { Component } from 'solid-js'
import type { Either } from '../monads/either'
import type { SelectedFilePathResult } from './FilePathSelector'
import type { SelectFilePath } from '../types/types'

// TODO: Enum for button variant

export const FilePathSelectorMode = {
  ...FilePathType,
  RegularFileAndDirectory: 'regularFileAndDirectory'
} as const

export type FilePathSelectorMode = typeof FilePathSelectorMode[keyof typeof FilePathSelectorMode]

export type ResolvedFilePath = {
  filePath: string
  isDirectory: boolean
};

type FilePathSelectorGroupProps = {
  filePathSelectorMode: FilePathSelectorMode
  selectFilePath: SelectFilePath
  singleSelection: boolean
  onChange: (result: Either<Error, ResolvedFilePath[]>) => void
}

export const FilePathSelectorGroup: Component<FilePathSelectorGroupProps> = (props) => {
  const [resolvedFilePaths, setResolvedFilePaths] = createSignal<ResolvedFilePath[]>([]);

  function showFilePathSelector(mode: FilePathSelectorMode): boolean {
    return (
      props.filePathSelectorMode === mode || props.filePathSelectorMode === FilePathSelectorMode.RegularFileAndDirectory
    )
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
  function addTrailingSlash(filePath: string): string {
    const forwardSlash = '/'
    return filePath.startsWith(forwardSlash) ? filePath + forwardSlash : filePath + '\\'
  }

  function updateResolvedFilePaths(paths: ResolvedFilePath[]) {
    setResolvedFilePaths(paths)
    props.onChange(right(paths))
  }
  
  const handleChange = (result: SelectedFilePathResult) => {
    if (isRight(result)) {
      if (result.value.filePath === null) {
        return
      }

      if (props.singleSelection) {
        updateResolvedFilePaths([createResolvedFilePath(result.value.filePath, result.value.isDirectory)])
      } else {
        const filteredPaths: ResolvedFilePath[] = [];
        const newPathWithSlash = addTrailingSlash(result.value.filePath)
        for (const path of resolvedFilePaths()) {
          const pathWithSlash = addTrailingSlash(path.filePath)
          if (newPathWithSlash === pathWithSlash || newPathWithSlash.startsWith(pathWithSlash)) {
            return
          }

          if (!pathWithSlash.startsWith(newPathWithSlash)) {
            filteredPaths.push(path)
          }
        }
        updateResolvedFilePaths([
          ...filteredPaths,
          createResolvedFilePath(result.value.filePath, result.value.isDirectory)
        ])
      }
    } else {
      props.onChange(left(result.value))
    }
  }

  const handlePress = () => {
    setResolvedFilePaths([])
  }

  return (
    <div>
      <div>
        {showFilePathSelector(FilePathSelectorMode.RegularFile) && (
          <FilePathSelector
            filePathType={FilePathType.RegularFile}
            selectFilePath={props.selectFilePath}
            onChange={handleChange}
          />
        )}
        {showFilePathSelector(FilePathSelectorMode.Directory) && (
          <FilePathSelector
            filePathType={FilePathType.Directory}
            selectFilePath={props.selectFilePath}
            onChange={handleChange}
          />
        )}
      </div>
      <ul>
        <For each={resolvedFilePaths()}>
          {(path) => <li>{path.filePath}</li>}
        </For>
      </ul>
      <Button
        disabled={false}
        onPress={handlePress}
        text={'reset'}
        variant={'tertiary'}
      />
    </div>
  )
}