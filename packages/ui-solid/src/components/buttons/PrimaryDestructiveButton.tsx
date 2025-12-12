import { Button, ButtonVariants } from './Button'
import type { Component } from 'solid-js'
import type { ButtonParentProps } from './Button'

type PrimaryDestructiveButtonProps = ButtonParentProps

export const PrimaryDestructiveButton: Component<PrimaryDestructiveButtonProps> = props => (
  <Button
    {...props}
    variant={ButtonVariants.primaryDestructive}
  />
)