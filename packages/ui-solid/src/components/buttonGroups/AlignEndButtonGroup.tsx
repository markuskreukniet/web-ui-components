import { ButtonGroup } from './ButtonGroup'
import type { ParentComponent } from 'solid-js'

export const AlignEndButtonGroup: ParentComponent = props => (
  <ButtonGroup alignEnd>{props.children}</ButtonGroup>
)