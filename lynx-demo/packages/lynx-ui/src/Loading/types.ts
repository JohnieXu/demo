import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export type LoadingType = 'circular' | 'spinner'

export interface LoadingProps {
  type?: LoadingType
  size?: Numeric
  color?: string
  vertical?: boolean
  textSize?: Numeric
  textColor?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
