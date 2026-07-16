import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export type CellSize = 'normal' | 'large'

export type CellArrowDirection = 'up' | 'down' | 'left' | 'right'

export interface CellProps {
  icon?: ReactNode
  size?: CellSize
  title?: Numeric
  value?: Numeric
  label?: Numeric
  center?: boolean
  isLink?: boolean
  border?: boolean
  titleClass?: string
  valueClass?: string
  labelClass?: string
  titleStyle?: CSSProperties
  arrowDirection?: CellArrowDirection
  required?: boolean | 'auto'
  clickable?: boolean | null
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
}
