import { Button, ButtonVariants } from './buttons/Button'
import { mapRight } from '../modules/monads/either'
import type { Component } from 'solid-js'
import type { Either } from '../modules/monads/either'
import type { SelectFilePath } from '../types/types'

export const FilePathTypes = {
  regularFile: 'regularFile',
  directory: 'directory'
} as const

type FilePathType = typeof FilePathTypes[keyof typeof FilePathTypes]

type SelectedFilePath = {
  filePath: string | null
  isDirectory: boolean
}

export type SelectedFilePathEither = Either<Error, SelectedFilePath>

type FilePathSelectorProps = {
  filePathType: FilePathType
  selectFilePath: SelectFilePath
  onChange: (either: SelectedFilePathEither) => void
}

export const FilePathSelector: Component<FilePathSelectorProps> = (props) => {
  const handler = async () => {
    props.onChange(mapRight(await props.selectFilePath(), path => ({
      filePath: path,
      isDirectory: path !== null && props.filePathType === FilePathTypes.directory
    })))
  }

  return (
    <Button
      disabled={false}
      onPress={handler}
      content={`add a ${props.filePathType === FilePathTypes.regularFile ? 'file' : 'directory'}`}
      variant={ButtonVariants.secondary}
    />
  )
}