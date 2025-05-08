import { Button } from './Button'
import { mapRight } from '../monads/either'
import type { Component } from 'solid-js'
import type { Either } from '../monads/either'

export type FilePathType = 'regularFile' | 'directory'

export type FilePathEntry = {
  selectedFilePath: string | null
  selectedFilePathType: FilePathType | null
};

export type FilePathEntryResult = Either<Error, FilePathEntry>

type FilePathEntrySelectorProps = {
  filePathType: FilePathType
  selectFilePath: () => Promise<Either<Error, string>>
  onChange: (result: Either<Error, FilePathEntry>) => void
}

export const FilePathEntrySelector: Component<FilePathEntrySelectorProps> = (props) => {
  const handler = async () => {
    props.onChange(mapRight(await props.selectFilePath(), selectedFilePath => ({
      selectedFilePath,
      selectedFilePathType: selectedFilePath ? props.filePathType : null
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