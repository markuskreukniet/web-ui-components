import { createSignal } from 'solid-js'
import { SubmitButton } from './buttons/SubmitButton'
import { FilePathSelectorGroup, FilePathSelectorModes } from './FilePathSelectorGroup'
import { isRight, left, right } from '../modules/monads/either'
import type { Component } from 'solid-js'
import type { FilePathSelectorMode, ResolvedFilePaths, ResolvedPathsEither } from './FilePathSelectorGroup'
import type { Either } from '../modules/monads/either'
import type { SelectFilePath } from '../types/types'

type SourceTargetContext = {
  sourceFilePaths: ResolvedFilePaths,
  targetFilePaths: ResolvedFilePaths // Nullable is not used by design. Use an empty array to indicate no paths.
}

export type SourceTargetContextEither = Either<Error, SourceTargetContext>

export type OnChangeSourceTargetContextEither = (either: SourceTargetContextEither) => void

type FilePathSelectionFormProps = {
  filePathSelectorMode: FilePathSelectorMode
  selectFilePath: SelectFilePath
  singleSelection: boolean
  enableTargetSelection: boolean
  isLoading: boolean
  onChange: OnChangeSourceTargetContextEither
}

type UpdateResolvedPathsState = (paths: ResolvedFilePaths) => void

export const FilePathSelectionForm: Component<FilePathSelectionFormProps> = (props) => {
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
      setIsDisabled(sourcePaths.length === 0)
    })
  }

  const buildPathSelectionHandler = (updateResolvedPathsState: UpdateResolvedPathsState) =>
    (either: ResolvedPathsEither) => {
      applyResolvedPathsResult(either, paths => {
        updateResolvedPathsState(paths)
        setIsDisabled(sourcePaths.length === 0 || targetPaths.length === 0)
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

  // Defined once to maintain consistent rendering and avoid duplication across conditional logic.
  const submitButton = <SubmitButton
    disabled={isDisabled()}
    isLoading={props.isLoading}
    onPress={handlerPress}
  />

  // Inline conditionals are simpler here than a single branching block with extra setup logic.
  return (
    <div>
      <FilePathSelectorGroup
        filePathSelectorMode={props.filePathSelectorMode}
        selectFilePath={props.selectFilePath}
        onChange={props.enableTargetSelection ? handlerChangeSource : handlerChangeSourceOnly}
        singleSelection={props.singleSelection}
        submitButton={props.enableTargetSelection ? null : submitButton}
      />
      {props.enableTargetSelection && (
        <FilePathSelectorGroup
          filePathSelectorMode={FilePathSelectorModes.directory}
          selectFilePath={props.selectFilePath}
          onChange={handlerChangeTarget}
          singleSelection
          submitButton={null}
        />
      ) && (
        submitButton
      )}
    </div>
  )
}