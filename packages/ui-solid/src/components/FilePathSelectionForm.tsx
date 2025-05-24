import { createSignal } from 'solid-js'
import { isRight, left, right } from '../monads/either'
import { FilePathSelectorGroup, FilePathSelectorMode } from './FilePathSelectorGroup'
import { SubmitButton } from './SubmitButton'
import type { Component } from 'solid-js'
import type { Either } from '../monads/either'
import type { ResolvedFilePath, ResolvedPathsResult } from './FilePathSelectorGroup'
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
  const [isDisabled, setIsDisabled] = createSignal<boolean>(true);

  let sourceFilePaths: ResolvedFilePath[] = []
  let targetFilePaths: ResolvedFilePath[] = []

  // TODO: naming + WIP + handleChangeSimple and handleChange are similar
  const handleChangeSimple = (result: ResolvedPathsResult) => {
    if (isRight(result)) {
      sourceFilePaths = result.value
    } else {
      props.onChange(left(result.value))
    }
  }

  const handleChange = (result: ResolvedPathsResult, forSource: boolean) => {
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

  // Defined once to maintain consistent rendering and avoid duplication across conditional logic.
  const submitButton = <SubmitButton
    disabled={isDisabled()}
    onPress={handlePress}
  />

  // Inline conditionals are simpler here than a single branching block with extra setup logic.
  return (
    <div>
      <FilePathSelectorGroup
        filePathSelectorMode={props.filePathSelectorMode}
        selectFilePath={props.selectFilePath}
        onChange={props.enableTargetSelection ? result => handleChange(result, true) : handleChangeSimple}
        singleSelection={false}
        submitButton={props.enableTargetSelection ? null : submitButton}
      />
      {props.enableTargetSelection && (
        <FilePathSelectorGroup
          filePathSelectorMode={FilePathSelectorMode.directory}
          selectFilePath={props.selectFilePath}
          onChange={result => handleChange(result, false)}
          singleSelection
          submitButton={null}
        />
      ) && (
        submitButton
      )}
    </div>
  )
}