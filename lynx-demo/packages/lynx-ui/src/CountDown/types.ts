import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric, UseCountDownCurrent } from '../utils'

export interface CountDownProps {
  time?: Numeric
  format?: string
  autoStart?: boolean
  millisecond?: boolean
  children?: (current: UseCountDownCurrent) => ReactNode
  className?: string
  style?: CSSProperties
  onChange?: (current: UseCountDownCurrent) => void
  onFinish?: () => void
}
