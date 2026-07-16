import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export type DividerContentPosition = 'left' | 'center' | 'right'

export interface DividerProps {
  dashed?: boolean
  vertical?: boolean
  contentPosition?: DividerContentPosition
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
