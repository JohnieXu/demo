import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export type GridDirection = 'horizontal' | 'vertical'

export interface GridProps {
  square?: boolean
  center?: boolean
  border?: boolean
  gutter?: Numeric
  reverse?: boolean
  iconSize?: Numeric
  direction?: GridDirection
  clickable?: boolean
  columnNum?: Numeric
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
