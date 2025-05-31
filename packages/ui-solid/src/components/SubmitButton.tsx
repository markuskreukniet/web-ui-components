import { Button, ButtonAttributes } from './Button'
import type { Component } from 'solid-js'
import type { ButtonBaseProps } from './Button'

type SubmitButtonProps = ButtonBaseProps & {
  isSubmitting: boolean
}

// TODO: make it possible to not only add text but also a progress spinner inside the button

export const SubmitButton: Component<SubmitButtonProps> = (props) => {
  return (
    <Button
      disabled={props.disabled || props.isSubmitting}
      onPress={props.onPress}
      text={'submit'}
      buttonAttributes={ButtonAttributes.primary}
    />
  )
}