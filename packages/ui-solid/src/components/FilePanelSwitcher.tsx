import type { Component } from 'solid-js'
import type { FilePathSelectionFormBaseProps, OnChangeSourceTargetContextEither } from './FilePathSelectionForm'
import type { CanDeleteProps } from './FileResultInspector'
import type { FileResultTableDataProps, OnChangeSelectedGroupRowsProps } from './FileResultTable'

type FilePanelSwitcherProps =
  FilePathSelectionFormBaseProps & FileResultTableDataProps & CanDeleteProps & OnChangeSelectedGroupRowsProps & {
  // Declares a separate prop of type OnChangeSourceTargetContextEither
  onChangeSourceTargetContextEither: OnChangeSourceTargetContextEither
}

// TODO: this component is useless? When removing also check props above here
// TODO: also remove SegmentedControl component?
export const FilePanelSwitcher: Component<FilePanelSwitcherProps> = props => {
  return (<></>)
}
