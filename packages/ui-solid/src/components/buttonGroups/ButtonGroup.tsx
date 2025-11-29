import type { ParentComponent } from 'solid-js'

type ButtonGroupProps = {
  alignEnd?: boolean
}

export const ButtonGroup: ParentComponent<ButtonGroupProps> = props => (
  <div class={props.alignEnd ? 'button-group--align-end' : 'button-group--align-start'}>{props.children}</div>
)