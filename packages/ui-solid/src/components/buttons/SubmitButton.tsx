import { ButtonVariants } from './Button'
import { LoadingButton } from './LoadingButton'
import type { Component } from 'solid-js'
import type { LoadingButtonBaseProps } from './LoadingButton'

type SubmitButtonProps = LoadingButtonBaseProps

export const SubmitButton: Component<SubmitButtonProps> = (props) => {
  const submit = 'submit'

  return (
    <LoadingButton
      isLoading={props.isLoading}
      disabled={props.disabled}
      onPress={props.onPress}
      content={submit}
      variant={ButtonVariants.primary}
    />
  )
}