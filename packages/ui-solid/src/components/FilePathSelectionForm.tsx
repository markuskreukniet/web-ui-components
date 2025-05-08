import { isRight, left, right } from '../monads/either'
import { FilePathSelectorGroup, FilePathSelectorMode } from './FilePathSelectorGroup'
import { SubmitButton } from './SubmitButton'
import type { Component } from 'solid-js'
import type { Either } from '../monads/either'
import type { ResolvedFilePath } from './FilePathSelectorGroup'
import type { SelectFilePath } from '../types/types'

type SourceTargetContext = {
  sourceFilePaths: ResolvedFilePath[],
  targetFilePaths: ResolvedFilePath[] // Nullable is not used by design. Use an empty array to indicate no paths.
}

type FilePathSelectionFormProps = {
  filePathSelectorMode: FilePathSelectorMode
  selectFilePath: SelectFilePath
  singleSelection: boolean
  enableTargetSelection: boolean
  onChange: (result: Either<Error, SourceTargetContext>) => void
}

export const FilePathSelectionForm: Component<FilePathSelectionFormProps> = (props) => {
  let sourceFilePaths: ResolvedFilePath[] = []
  let targetFilePaths: ResolvedFilePath[] = []

  const handleChange = (result: Either<Error, ResolvedFilePath[]>, forSource: boolean) => {
    if (isRight(result)) {
      if (forSource) {
        sourceFilePaths = result.value
      } else {
        targetFilePaths = result.value
      }
    } else {
      props.onChange(left(result.value))
    }
  }

  const handlePress = () => {
    props.onChange(right({
      sourceFilePaths: sourceFilePaths,
      targetFilePaths: targetFilePaths
    }))
  }

  return (
    <div>
      <div>
        <FilePathSelectorGroup
          filePathSelectorMode={props.filePathSelectorMode}
          selectFilePath={props.selectFilePath}
          onChange={result => handleChange(result, true)}
          singleSelection={false}
        />
        {props.enableTargetSelection && (
          <FilePathSelectorGroup
            filePathSelectorMode={FilePathSelectorMode.Directory}
            selectFilePath={props.selectFilePath}
            onChange={result => handleChange(result, false)}
            singleSelection
          />
        )}
      </div>
      <SubmitButton
        disabled={false}
        onPress={handlePress}
      />
    </div>
  )
}