import { Button, ButtonAttributes } from './Button'
import type { Component } from 'solid-js'
import type { ButtonBaseProps } from './Button'

type SubmitButtonProps = ButtonBaseProps & {
  isSubmitting: boolean
}

// TODO: moet eigenlijk on submitting hebben. en dan bij klikken gelijk disabled zijn tot submitting klaar is

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