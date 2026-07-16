import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface NoticeBarProps {
  text?: string
  mode?: 'closeable' | 'link'
  color?: string
  background?: string
  delay?: number
  speed?: number
  scrollable?: boolean
  wrapable?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClose?: () => void
  onClick?: () => void
}
