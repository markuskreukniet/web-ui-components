import { createSignal, For } from 'solid-js'
import { AlignEndButtonGroup } from "./buttonGroups/AlignEndButtonGroup"
import { ButtonGroup } from "./buttonGroups/ButtonGroup"
import { CloseButton } from './buttons/iconButtons/CloseButton'
import { TertiaryButton } from './buttons/TertiaryButton'
import { FilePathSelector, FilePathTypes } from './FilePathSelector'
import { isRight, left, right } from '../modules/monads/either'
import { isArrayEmpty } from 'shared'
import type { Component, JSX } from 'solid-js'
import type { IsDirectory, SelectedFilePathEither } from './FilePathSelector'
import type { Either } from '../modules/monads/either'
import type { SelectFilePathProps } from '../types/types'

export const FilePathSelectorModes = {
  ...FilePathTypes,
  regularFileAndDirectory: 'regularFileAndDirectory'
} as const

export type FilePathSelectorMode = typeof FilePathSelectorModes[keyof typeof FilePathSelectorModes]

type ResolvedFilePath = IsDirectory & {
  filePath: string
  elidedPath: string
}

export type ResolvedFilePaths = ResolvedFilePath[]

export type ResolvedPathsEither = Either<Error, ResolvedFilePaths>

export type FilePathSelectorGroupBaseProps = SelectFilePathProps & {
  filePathSelectorMode: FilePathSelectorMode
  singleSelection: boolean
}

type FilePathSelectorGroupProps = FilePathSelectorGroupBaseProps & {
  onChange: (either: ResolvedPathsEither) => void
  submitButton?: JSX.Element
}

function createResolvedFilePath(filePath: string, isDirectory: boolean): ResolvedFilePath {
  const path = {
    filePath,
    isDirectory,
    elidedPath: filePath
  }

  let maximumCharacters = 89
  if (filePath.length > maximumCharacters) {
    maximumCharacters--
    path.elidedPath = `${
      filePath.slice(0, Math.ceil(maximumCharacters / 2))
    }…${
      filePath.slice(filePath.length - Math.floor(maximumCharacters / 2))
    }`
  }

  return path
}

// Add a trailing slash to a file path.
// Without the trailing slash, /path/sub is a parent of /path/subpath.
// This trailing slash method should also work on non-Windows systems.
function addTrailingSlash(filePath: string): string {
  const forwardSlash = '/'
  return filePath.startsWith(forwardSlash) ? filePath + forwardSlash : filePath + '\\'
}

export const FilePathSelectorGroup: Component<FilePathSelectorGroupProps> = props => {
  const [resolvedFilePaths, setResolvedFilePaths] = createSignal<ResolvedFilePaths>([])

  const handlerUpdateResolvedFilePaths = (paths: ResolvedFilePaths) => () => updateResolvedFilePaths(paths)

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

  const handler = (either: SelectedFilePathEither) => {
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

  return (
    <div class="file-path-selector-group">
      <ButtonGroup>
        {shouldRenderSelectorFor(FilePathSelectorModes.regularFile) && (
          <FilePathSelector
            filePathType={FilePathTypes.regularFile}
            selectFilePath={props.selectFilePath}
            onChange={handler}
          />
        )}
        {shouldRenderSelectorFor(FilePathSelectorModes.directory) && (
          <FilePathSelector
            filePathType={FilePathTypes.directory}
            selectFilePath={props.selectFilePath}
            onChange={handler}
          />
        )}
      </ButtonGroup>
      <div class="file-path-selector-group__file-paths-wrapper">
        <ul>
          <For each={resolvedFilePaths()}>
            {(path, index) =>
              <li>
                <span class="file-path">{path.elidedPath}</span>
                <CloseButton
                  onPress={handlerUpdateResolvedFilePaths(resolvedFilePaths().filter((_, i) => i !== index()))}
                />
              </li>
            }
          </For>
        </ul>
      </div>
      <AlignEndButtonGroup>
        <TertiaryButton
          onPress={handlerUpdateResolvedFilePaths([])}
          disabled={isArrayEmpty(resolvedFilePaths())}
        >
          Clear
        </TertiaryButton>
        {props.submitButton}
      </AlignEndButtonGroup>
    </div>
  )
}