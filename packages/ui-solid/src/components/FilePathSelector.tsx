import { SecondaryButton } from './buttons/SecondaryButton'
import { mapRight } from '../modules/monads/either'
import type { Component } from 'solid-js'
import type { Either } from '../modules/monads/either'
import type { SelectFilePathProps } from '../types/types'

export const FilePathTypes = {
  regularFile: 'regularFile',
  directory: 'directory'
} as const

type FilePathType = typeof FilePathTypes[keyof typeof FilePathTypes]

export type IsDirectory = {
  isDirectory: boolean
}

type SelectedFilePath = IsDirectory & {
  filePath: string | null
}

export type SelectedFilePathEither = Either<Error, SelectedFilePath>

type FilePathSelectorProps = SelectFilePathProps & {
  filePathType: FilePathType
  onChange: (either: SelectedFilePathEither) => void
}

export const FilePathSelector: Component<FilePathSelectorProps> = props => {
  const handler = async () => {
    props.onChange(mapRight(await props.selectFilePath(), path => ({
      filePath: path,
      isDirectory: path !== null && props.filePathType === FilePathTypes.directory
    })))
  }

  return (
    <SecondaryButton onPress={handler}>
      {`Add a ${props.filePathType === FilePathTypes.regularFile ? 'file' : 'directory'}`}
    </SecondaryButton>
  )
}