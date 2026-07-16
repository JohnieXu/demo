import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface CheckboxProps {
  shape?: 'square' | 'round'
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  name?: string | number
  labelPosition?: 'left' | 'right'
  labelDisabled?: boolean
  iconSize?: number | string
  checkedColor?: string
  indeterminate?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onChange?: (checked: boolean) => void
}
