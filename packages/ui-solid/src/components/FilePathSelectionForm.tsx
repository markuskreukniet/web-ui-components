import { createSignal } from 'solid-js'
import { isRight, left, right } from '../monads/either'
import { SubmitButton } from './buttons/SubmitButton'
import { FilePathSelectorGroup, FilePathSelectorMode } from './FilePathSelectorGroup'
import type { Component } from 'solid-js'
import type { ResolvedFilePath, ResolvedPathsResult } from './FilePathSelectorGroup'
import type { Either } from '../monads/either'
import type { SelectFilePath } from '../types/types'

type SourceTargetContext = {
  sourceFilePaths: ResolvedFilePath[],
  targetFilePaths: ResolvedFilePath[] // Nullable is not used by design. Use an empty array to indicate no paths.
}

export type OnChangeSourceTargetContextResult = (result: Either<Error, SourceTargetContext>) => void

type FilePathSelectionFormProps = {
  filePathSelectorMode: FilePathSelectorMode
  selectFilePath: SelectFilePath
  singleSelection: boolean
  enableTargetSelection: boolean
  isLoading: boolean
  onChange: OnChangeSourceTargetContextResult
}

export const FilePathSelectionForm: Component<FilePathSelectionFormProps> = (props) => {
  const [isDisabled, setIsDisabled] = createSignal<boolean>(true);

  let sourceFilePaths: ResolvedFilePath[] = []
  let targetFilePaths: ResolvedFilePath[] = []

  const processResolvedPathsResult = (result: ResolvedPathsResult, setPaths: (paths: ResolvedFilePath[]) => void) => {
    if (isRight(result)) {
      setPaths(result.value)
    } else {
      props.onChange(left(result.value))
    }
  }

  const handleChangeSourceOnly = (result: ResolvedPathsResult) => {
    processResolvedPathsResult(result, paths => {
      sourceFilePaths = paths
    })
  }

  const createResolvedPathsHandler = (setPaths: (paths: ResolvedFilePath[]) => void) =>
    (result: ResolvedPathsResult) => {
      processResolvedPathsResult(result, paths => {
        setPaths(paths)

        if (sourceFilePaths.length > 0 && targetFilePaths.length > 0) {
          setIsDisabled(false)
        } else {
          setIsDisabled(true)
        }
      })
  }

  const handleChangeSource = createResolvedPathsHandler(paths => { sourceFilePaths = paths })
  const handleChangeTarget = createResolvedPathsHandler(paths => { targetFilePaths = paths })

  const handlePress = () => {
    props.onChange(right({
      sourceFilePaths: sourceFilePaths,
      targetFilePaths: targetFilePaths
    }))
  }

  // Defined once to maintain consistent rendering and avoid duplication across conditional logic.
  const submitButton = <SubmitButton
    disabled={isDisabled()}
    isLoading={props.isLoading}
    onPress={handlePress}
  />

  // Inline conditionals are simpler here than a single branching block with extra setup logic.
  return (
    <div>
      <FilePathSelectorGroup
        filePathSelectorMode={props.filePathSelectorMode}
        selectFilePath={props.selectFilePath}
        onChange={props.enableTargetSelection ? handleChangeSource : handleChangeSourceOnly}
        singleSelection={false}
        submitButton={props.enableTargetSelection ? null : submitButton}
      />
      {props.enableTargetSelection && (
        <FilePathSelectorGroup
          filePathSelectorMode={FilePathSelectorMode.directory}
          selectFilePath={props.selectFilePath}
          onChange={handleChangeTarget}
          singleSelection
          submitButton={null}
        />
      ) && (
        submitButton
      )}
    </div>
  )
}