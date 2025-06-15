import { Button } from './Button'
import { ProgressCircle } from '../ProgressCircle'
import type { Component } from 'solid-js'
import type { ButtonBaseProps, ButtonProps } from './Button'

type IsLoading = {
  isLoading: boolean
}

export type LoadingButtonBaseProps = ButtonBaseProps & IsLoading

type LoadingButtonProps = ButtonProps & IsLoading

export const LoadingButton: Component<LoadingButtonProps> = (props) => {
  return (
    <Button
      disabled={props.disabled}
      onPress={props.onPress}
      content={props.isLoading ? <span><ProgressCircle />{props.content}</span> : props.content}
      variant={props.variant}
    />
  )
}