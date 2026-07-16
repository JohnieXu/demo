import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface EmptyProps {
  image?: 'default' | 'error' | 'network' | 'search' | ReactNode
  imageSize?: Numeric | [Numeric, Numeric]
  description?: ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
