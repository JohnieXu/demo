import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export type RowAlign = 'top' | 'center' | 'bottom'
export type RowJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'

export interface RowProps {
  wrap?: boolean
  align?: RowAlign
  gutter?: Numeric | [Numeric, Numeric]
  justify?: RowJustify
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
