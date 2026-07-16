import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface ProgressProps {
  color?: string
  inactive?: boolean
  pivotText?: string
  textColor?: string
  showPivot?: boolean
  pivotColor?: string
  trackColor?: string
  strokeWidth?: Numeric
  percentage?: Numeric
  className?: string
  style?: CSSProperties
}
