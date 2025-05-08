import type { Component } from 'solid-js'

export type ProgressCircleProps = {
  isLoading: boolean
}

export const ProgressCircle: Component<ProgressCircleProps> = (props) => {
  return (
    <div id="progress-circle" classList={{ 'display-none': !props.isLoading }} /> // TODO: should be id or class?
  )
}