import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface RadioGroupProps {
  value?: string | number
  defaultValue?: string | number
  disabled?: boolean
  checkedColor?: string
  direction?: 'horizontal' | 'vertical'
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onChange?: (value: string | number) => void
}
