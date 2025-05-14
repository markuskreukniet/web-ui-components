import { Button } from './Button'
import { mapRight } from '../monads/either'
import type { Component } from 'solid-js'
import type { Either } from '../monads/either'

export type FilePathType = 'regularFile' | 'directory'

type SelectedFilePath = {
  filePath: string | null
  isDirectory: boolean
};

export type SelectedFilePathResult = Either<Error, SelectedFilePath>

type FilePathSelectorProps = {
  filePathType: FilePathType
  selectFilePath: () => Promise<Either<Error, string | null>>
  onChange: (result: Either<Error, SelectedFilePath>) => void
}

export const FilePathSelector: Component<FilePathSelectorProps> = (props) => {
  const handler = async () => {
    props.onChange(mapRight(await props.selectFilePath(), selectedFilePath => ({
      filePath: selectedFilePath,
      isDirectory: selectedFilePath !== null && props.filePathType === 'directory'
    })));
  }

  return (
    <Button
      disabled={false}
      onPress={handler}
      text={`add a ${props.filePathType === 'regularFile' ?  'file' : 'directory'}`}
      variant={'secondary'}
    />
  )
}