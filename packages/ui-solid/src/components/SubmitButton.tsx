import { Button, ButtonAttributes } from './Button'
import type { Component } from 'solid-js'

export type SubmitButtonProps = {
  disabled: boolean
  onPress: () => void
}

export const SubmitButton: Component<SubmitButtonProps> = (props) => {
  return (
    <Button
      disabled={props.disabled}
      onPress={props.onPress}
      text={'submit'}
      buttonAttributes={ButtonAttributes.primary}
    />
  )
}