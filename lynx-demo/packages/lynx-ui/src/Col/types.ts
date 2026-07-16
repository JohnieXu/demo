import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface ColProps {
  span?: Numeric
  offset?: Numeric
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
