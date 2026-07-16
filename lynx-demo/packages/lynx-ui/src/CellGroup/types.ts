import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface CellGroupProps {
  title?: ReactNode
  inset?: boolean
  border?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
