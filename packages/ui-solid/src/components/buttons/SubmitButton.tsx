import { Button, ButtonVariants } from './Button'
import { ProgressCircle } from '../ProgressCircle'
import type { Component } from 'solid-js'
import type { ButtonBaseProps } from './Button'

type SubmitButtonProps = ButtonBaseProps & {
  isLoading: boolean
}

export const SubmitButton: Component<SubmitButtonProps> = (props) => {
  const submit = 'submit'

  return (
    <Button
      disabled={props.disabled}
      onPress={props.onPress}
      content={props.isLoading ? <span><ProgressCircle />{submit}</span> : submit}
      variant={ButtonVariants.primary}
    />
  )
}