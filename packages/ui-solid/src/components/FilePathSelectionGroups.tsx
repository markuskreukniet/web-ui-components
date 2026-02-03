import { createSignal } from 'solid-js'
import { SubmitButton } from './buttons/SubmitButton'
import { FilePathSelectorGroup, FilePathSelectorModes } from './FilePathSelectorGroup'
import { isArrayEmpty, isRight, left, right } from 'shared'
import type { Component } from 'solid-js'
import type { FilePathSelectorGroupBaseProps, ResolvedFilePaths, ResolvedPathsEither } from './FilePathSelectorGroup'
import type { Either, IsLoadingProps } from 'shared'

type InputOutputContext = {
  inputFilePaths: ResolvedFilePaths,
  outputFilePaths: ResolvedFilePaths
}

export type InputOutputContextEither = Either<Error, InputOutputContext>

type FilePathSelectionGroupsProps = FilePathSelectorGroupBaseProps & IsLoadingProps & {
  enableOutput: boolean
  onChange: (either: InputOutputContextEither) => void
}

export const FilePathSelectionGroups: Component<FilePathSelectionGroupsProps> = props => {
  const [isDisabled, setIsDisabled] = createSignal<boolean>(true)

  let inputPaths: ResolvedFilePaths = []
  let outputPaths: ResolvedFilePaths = []

  const handlerPress = () => {
    props.onChange(right({
      inputFilePaths: inputPaths,
      outputFilePaths: outputPaths
    }))
  }

  const button = <SubmitButton
    disabled={isDisabled()}
    isLoading={props.isLoading}
    onPress={handlerPress}
  />

  const setOutputPaths = (paths: ResolvedFilePaths) => { outputPaths = paths }

  const setInputPaths = (paths: ResolvedFilePaths) => { inputPaths = paths }

  const isInputPathsEmpty = (paths: ResolvedFilePaths) => { return isArrayEmpty(paths) }

  const areInputAndOutputPathsEmpty = (paths: ResolvedFilePaths) => {
    return isArrayEmpty(paths) || isArrayEmpty(outputPaths)
  }

  const handlerEither = (
    either: ResolvedPathsEither,
    setPaths: (paths: ResolvedFilePaths) => void,
    arePathsEmpty: (paths: ResolvedFilePaths) => boolean
  ) => {
    if (isRight(either)) {
      setPaths(either.value)
      setIsDisabled(arePathsEmpty(either.value))
    } else {
      props.onChange(left(either.value))
    }
  }

  const handlerChangeInput = props.enableOutput
    ? (either: ResolvedPathsEither) => { handlerEither(either, setInputPaths, areInputAndOutputPathsEmpty) }
    : (either: ResolvedPathsEither) => { handlerEither(either, setInputPaths, isInputPathsEmpty) }

  const handlerChangeOutput = (either: ResolvedPathsEither) => {
    handlerEither(either, setOutputPaths, areInputAndOutputPathsEmpty)
  }

  return (
    <div class="file-path-selection-groups">
      <FilePathSelectorGroup
        filePathSelectorMode={props.filePathSelectorMode}
        selectFilePath={props.selectFilePath}
        onChange={handlerChangeInput}
        singleSelection={props.singleSelection}
        {...(!props.enableOutput && { button })}
      />
      {props.enableOutput && (
        <FilePathSelectorGroup
          filePathSelectorMode={FilePathSelectorModes.directory}
          selectFilePath={props.selectFilePath}
          onChange={handlerChangeOutput}
          singleSelection
        />
      ) && (
        button
      )}
    </div>
  )
}