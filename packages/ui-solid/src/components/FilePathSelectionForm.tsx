import { createSignal } from 'solid-js'
import { SubmitButton } from './buttons/SubmitButton'
import { FilePathSelectorGroup, FilePathSelectorModes } from './FilePathSelectorGroup'
import { isRight, left, right } from '../modules/monads/either'
import { isArrayEmpty } from '../utils/isEmpty'
import type { Component } from 'solid-js'
import type { FilePathSelectorGroupBaseProps, ResolvedFilePaths, ResolvedPathsEither } from './FilePathSelectorGroup'
import type { Either } from '../modules/monads/either'
import type { IsLoadingProps } from '../types/types'

type SourceTargetContext = {
  sourceFilePaths: ResolvedFilePaths,
  targetFilePaths: ResolvedFilePaths // Nullable is not used by design. Use an empty array to indicate no paths.
}

export type SourceTargetContextEither = Either<Error, SourceTargetContext>

type FilePathSelectionFormProps = FilePathSelectorGroupBaseProps & IsLoadingProps & {
  enableTargetSelection: boolean
  onChange: (either: SourceTargetContextEither) => void
}

type UpdateResolvedPathsState = (paths: ResolvedFilePaths) => void

export const FilePathSelectionForm: Component<FilePathSelectionFormProps> = props => {
  const [isDisabled, setIsDisabled] = createSignal<boolean>(true)

  let sourcePaths: ResolvedFilePaths = []
  let targetPaths: ResolvedFilePaths = []

  const applyResolvedPathsResult = (
    either: ResolvedPathsEither, updateResolvedPathsState: UpdateResolvedPathsState
  ) => {
    if (isRight(either)) {
      updateResolvedPathsState(either.value)
    } else {
      props.onChange(left(either.value))
    }
  }

  const handlerChangeSourceOnly = (either: ResolvedPathsEither) => {
    applyResolvedPathsResult(either, paths => {
      sourcePaths = paths
      setIsDisabled(isArrayEmpty(sourcePaths))
    })
  }

  const buildPathSelectionHandler = (updateResolvedPathsState: UpdateResolvedPathsState) =>
    (either: ResolvedPathsEither) => {
      applyResolvedPathsResult(either, paths => {
        updateResolvedPathsState(paths)
        setIsDisabled(isArrayEmpty(sourcePaths) || isArrayEmpty(targetPaths))
      })
    }

  const handlerChangeSource = buildPathSelectionHandler(paths => { sourcePaths = paths })
  const handlerChangeTarget = buildPathSelectionHandler(paths => { targetPaths = paths })

  const handlerPress = () => {
    props.onChange(right({
      sourceFilePaths: sourcePaths,
      targetFilePaths: targetPaths
    }))
  }

  // TODO: does isDisabled makes sense?
  // Defined once to maintain consistent rendering and avoid duplication across conditional logic.
  const submitButton = <SubmitButton
    disabled={isDisabled()}
    isLoading={props.isLoading}
    onPress={handlerPress}
  />

  // Inline conditionals are simpler here than a single branching block with extra setup logic.
  return (
    <div class="file-path-selection-form">
      <FilePathSelectorGroup
        filePathSelectorMode={props.filePathSelectorMode}
        selectFilePath={props.selectFilePath}
        onChange={props.enableTargetSelection ? handlerChangeSource : handlerChangeSourceOnly}
        singleSelection={props.singleSelection}
        {...(!props.enableTargetSelection && { submitButton })}
      />
      {props.enableTargetSelection && (
        <FilePathSelectorGroup
          filePathSelectorMode={FilePathSelectorModes.directory}
          selectFilePath={props.selectFilePath}
          onChange={handlerChangeTarget}
          singleSelection
        />
      ) && (
        submitButton
      )}
    </div>
  )
}