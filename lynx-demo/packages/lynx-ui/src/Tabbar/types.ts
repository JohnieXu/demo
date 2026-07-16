import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface TabbarProps {
  active?: Numeric
  activeColor?: string
  inactiveColor?: string
  border?: boolean
  safeAreaInsetBottom?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onChange?: (value: number) => void
  onUpdateActive?: (value: number) => void
}
