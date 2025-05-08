import { createSignal } from 'solid-js'
import { isRight, left, right } from '../monads/either'
import { SubmitButton } from './buttons/SubmitButton'
import { FilePathSelectorGroup, FilePathSelectorModes } from './FilePathSelectorGroup'
import type { Component } from 'solid-js'
import type { FilePathSelectorMode, ResolvedFilePaths, ResolvedPathsResult } from './FilePathSelectorGroup'
import type { Either } from '../monads/either'
import type { SelectFilePath } from '../types/types'

type SourceTargetContext = {
  sourceFilePaths: ResolvedFilePaths,
  targetFilePaths: ResolvedFilePaths // Nullable is not used by design. Use an empty array to indicate no paths.
}

export type SourceTargetContextResult = Either<Error, SourceTargetContext>

export type OnChangeSourceTargetContextResult = (result: SourceTargetContextResult) => void

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

  let sourcePaths: ResolvedFilePaths = []
  let targetPaths: ResolvedFilePaths = []

  const processResolvedPathsResult = (result: ResolvedPathsResult, setPaths: (paths: ResolvedFilePaths) => void) => {
    if (isRight(result)) {
      setPaths(result.value)
    } else {
      props.onChange(left(result.value))
    }
  }

  const handleChangeSourceOnly = (result: ResolvedPathsResult) => {
    processResolvedPathsResult(result, paths => {
      sourcePaths = paths
    })
  }

  // TODO: how does it work? Is the result type good?
  const createResolvedPathsHandler = (setPaths: (paths: ResolvedFilePaths) => void) =>
    (result: ResolvedPathsResult) => {
      processResolvedPathsResult(result, paths => {
        setPaths(paths)

        if (sourcePaths.length > 0 && targetPaths.length > 0) {
          setIsDisabled(false)
        } else {
          setIsDisabled(true)
        }
      })
  }

  const handleChangeSource = createResolvedPathsHandler(paths => { sourcePaths = paths })
  const handleChangeTarget = createResolvedPathsHandler(paths => { targetPaths = paths })

  const handlePress = () => {
    props.onChange(right({
      sourceFilePaths: sourcePaths,
      targetFilePaths: targetPaths
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
          filePathSelectorMode={FilePathSelectorModes.directory}
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