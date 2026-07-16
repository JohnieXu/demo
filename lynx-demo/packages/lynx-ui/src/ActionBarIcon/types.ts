import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface ActionBarIconProps {
  icon?: ReactNode | string
  text?: string
  color?: string
  dot?: boolean
  badge?: string | number
  onClick?: () => void
  className?: string
  style?: CSSProperties
}
