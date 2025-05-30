import type { Component } from 'solid-js'

export type ProgressCircleProps = {
  isLoading: boolean
}

export const ProgressCircle: Component<ProgressCircleProps> = (props) => {
  return (
    <div class="progress-circle" classList={{ 'display-none': !props.isLoading }} />
  )
}