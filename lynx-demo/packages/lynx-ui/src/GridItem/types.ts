import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { BadgeProps } from '../Badge'
import type { Numeric } from '../utils'

export interface GridItemProps {
  dot?: boolean
  text?: string
  icon?: string
  badge?: Numeric
  iconColor?: string
  iconSize?: Numeric
  badgeProps?: Partial<BadgeProps>
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
}
