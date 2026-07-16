import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export type BadgePosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export interface BadgeProps {
  dot?: boolean
  max?: Numeric
  color?: string
  offset?: [Numeric, Numeric]
  content?: Numeric
  showZero?: boolean
  position?: BadgePosition
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
