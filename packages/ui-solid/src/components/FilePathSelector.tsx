import { Button, ButtonAttributes } from './Button'
import { mapRight } from '../monads/either'
import type { Component } from 'solid-js'
import type { Either } from '../monads/either'
import type { SelectFilePath } from '../types/types'

export const FilePathType = {
  regularFile: 'regularFile',
  directory: 'directory'
} as const

type FilePathType = typeof FilePathType[keyof typeof FilePathType]

type SelectedFilePath = {
  filePath: string | null
  isDirectory: boolean
};

export type SelectedFilePathResult = Either<Error, SelectedFilePath>

type FilePathSelectorProps = {
  filePathType: FilePathType
  selectFilePath: SelectFilePath
  onChange: (result: Either<Error, SelectedFilePath>) => void
}

export const FilePathSelector: Component<FilePathSelectorProps> = (props) => {
  const handler = async () => {
    props.onChange(mapRight(await props.selectFilePath(), selectedFilePath => ({
      filePath: selectedFilePath,
      isDirectory: selectedFilePath !== null && props.filePathType === FilePathType.directory
    })));
  }

  return (
    <Button
      disabled={false}
      onPress={handler}
      text={`add a ${props.filePathType === FilePathType.regularFile ? 'file' : 'directory'}`}
      buttonAttributes={ButtonAttributes.secondary}
    />
  )
}