import type { Component } from 'solid-js'
import type { OnChangeSourceTargetContextEither } from './FilePathSelectionForm'
import type { OnChangeSelectedGroupRowsProps } from './FileResultTable'

type FilePanelSwitcherProps = OnChangeSelectedGroupRowsProps & {
  // Declares a separate prop of type OnChangeSourceTargetContextEither
  onChangeSourceTargetContextEither: OnChangeSourceTargetContextEither
}

// TODO: this component is useless? When removing also check props above here
export const FilePanelSwitcher: Component<FilePanelSwitcherProps> = props => {
  return (<></>)
}
