import { splitProps } from 'solid-js'
import { Button } from '../Button'
import type { Component } from 'solid-js'
import type { ButtonProps } from '../Button'

type IconButtonProps = ButtonProps

export const IconButton: Component<IconButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ['content'])

  return (
    <Button
      {...rest}
      content={
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          {local.content}
        </svg>
      }
    />
  )
}