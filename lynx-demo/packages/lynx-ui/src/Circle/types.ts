import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export type CircleStartPosition = 'top' | 'right' | 'bottom' | 'left'

export interface CircleProps {
  text?: string
  size?: Numeric
  fill?: string
  rate?: Numeric
  speed?: Numeric
  color?: string | Record<string, string>
  clockwise?: boolean
  layerColor?: string
  currentRate?: number
  strokeWidth?: Numeric
  strokeLinecap?: string
  startPosition?: CircleStartPosition
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onUpdateCurrentRate?: (rate: number) => void
}
