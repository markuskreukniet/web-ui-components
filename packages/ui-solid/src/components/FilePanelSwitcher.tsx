import type { Component } from 'solid-js'
import type { OnChangeSourceTargetContextEither } from './FilePathSelectionForm'
import type { FileResultTableDataProps, OnChangeSelectedGroupRowsProps } from './FileResultTable'

type FilePanelSwitcherProps = FileResultTableDataProps & OnChangeSelectedGroupRowsProps & {
  // Declares a separate prop of type OnChangeSourceTargetContextEither
  onChangeSourceTargetContextEither: OnChangeSourceTargetContextEither
}

// TODO: this component is useless? When removing also check props above here
// TODO: also remove SegmentedControl component?
export const FilePanelSwitcher: Component<FilePanelSwitcherProps> = props => {
  return (<></>)
}
