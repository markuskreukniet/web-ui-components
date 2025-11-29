import { PrimaryButton } from './PrimaryButton'
import type { Component } from 'solid-js'
import type { ButtonParentProps } from './Button'

type SubmitButtonProps = ButtonParentProps

export const SubmitButton: Component<SubmitButtonProps> = props => (
  <PrimaryButton {...props}>Submit</PrimaryButton>
)