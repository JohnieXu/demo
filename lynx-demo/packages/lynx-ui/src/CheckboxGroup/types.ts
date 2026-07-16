import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface CheckboxGroupProps {
  value?: Array<string | number>
  defaultValue?: Array<string | number>
  disabled?: boolean
  max?: number
  shape?: 'square' | 'round'
  checkedColor?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onChange?: (value: Array<string | number>) => void
}
