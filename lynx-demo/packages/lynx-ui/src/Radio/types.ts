import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface RadioProps {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  name?: string | number
  labelPosition?: 'left' | 'right'
  labelDisabled?: boolean
  checkedColor?: string
  iconSize?: number | string
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onChange?: (checked: boolean) => void
}
