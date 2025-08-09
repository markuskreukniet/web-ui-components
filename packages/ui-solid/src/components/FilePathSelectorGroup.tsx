import { createSignal, For } from 'solid-js'
import { Button, ButtonVariants } from './buttons/Button'
import { isRight, left, right } from '../modules/monads/either'
import { FilePathSelector, FilePathTypes } from './FilePathSelector'
import type { Component, JSX } from 'solid-js'
import type { SelectedFilePathEither } from './FilePathSelector'
import type { Either } from '../modules/monads/either'
import type { SelectFilePath } from '../types/types'

export const FilePathSelectorModes = {
  ...FilePathTypes,
  regularFileAndDirectory: 'regularFileAndDirectory'
} as const

export type FilePathSelectorMode = typeof FilePathSelectorModes[keyof typeof FilePathSelectorModes]

type ResolvedFilePath = {
  filePath: string
  isDirectory: boolean
}

export type ResolvedFilePaths = ResolvedFilePath[]

export type ResolvedPathsEither = Either<Error, ResolvedFilePaths>

type FilePathSelectorGroupProps = {
  filePathSelectorMode: FilePathSelectorMode
  selectFilePath: SelectFilePath
  singleSelection: boolean
  onChange: (either: ResolvedPathsEither) => void
  submitButton: JSX.Element | null
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

export const FilePathSelectorGroup: Component<FilePathSelectorGroupProps> = (props) => {
  const [resolvedFilePaths, setResolvedFilePaths] = createSignal<ResolvedFilePaths>([])

  function shouldRenderSelectorFor(mode: FilePathSelectorMode): boolean {
    return (
      props.filePathSelectorMode === mode ||
      props.filePathSelectorMode === FilePathSelectorModes.regularFileAndDirectory
    )
  }

  function updateResolvedFilePaths(paths: ResolvedFilePaths) {
    setResolvedFilePaths(paths)
    props.onChange(right(paths))
  }

  const handlerChange = (either: SelectedFilePathEither) => {
    if (isRight(either)) {
      if (either.value.filePath === null) {
        return
      }

      if (props.singleSelection) {
        updateResolvedFilePaths([createResolvedFilePath(either.value.filePath, either.value.isDirectory)])
      } else {
        const filteredPaths: ResolvedFilePaths = []
        const newPathWithSlash = addTrailingSlash(either.value.filePath)
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
          createResolvedFilePath(either.value.filePath, either.value.isDirectory)
        ])
      }
    } else {
      props.onChange(left(either.value))
    }
  }

  const handlerPress = () => {
    updateResolvedFilePaths([])
  }

  return (
    <div>
      <div>
        {shouldRenderSelectorFor(FilePathSelectorModes.regularFile) && (
          <FilePathSelector
            filePathType={FilePathTypes.regularFile}
            selectFilePath={props.selectFilePath}
            onChange={handlerChange}
          />
        )}
        {shouldRenderSelectorFor(FilePathSelectorModes.directory) && (
          <FilePathSelector
            filePathType={FilePathTypes.directory}
            selectFilePath={props.selectFilePath}
            onChange={handlerChange}
          />
        )}
      </div>
      <ul>
        <For each={resolvedFilePaths()}>
          {path => <li>{path.filePath}</li>}
        </For>
      </ul>
      <Button
        onPress={handlerPress}
        content={'reset'}
        variant={ButtonVariants.tertiary}
      />
      {props.submitButton}
    </div>
  )
}