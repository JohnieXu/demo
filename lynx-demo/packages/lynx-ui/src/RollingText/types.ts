import type { CSSProperties } from '@lynx-js/types'

export type RollingTextDirection = 'up' | 'down'
export type RollingTextStopOrder = 'ltr' | 'rtl'

export interface RollingTextProps {
  startNum?: number
  targetNum?: number
  textList?: string[]
  duration?: number
  autoStart?: boolean
  direction?: RollingTextDirection
  stopOrder?: RollingTextStopOrder
  height?: number
  className?: string
  style?: CSSProperties
}

export interface RollingTextItemProps {
  figureArr: (string | number)[]
  delay?: number
  duration?: number
  isStart?: boolean
  direction?: RollingTextDirection
  height?: number
}
