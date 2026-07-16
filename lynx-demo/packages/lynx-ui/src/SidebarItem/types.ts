import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { BadgeProps } from '../Badge'
import type { Numeric } from '../utils'

export interface SidebarItemProps {
  dot?: boolean
  title?: string
  badge?: Numeric
  disabled?: boolean
  badgeProps?: Partial<BadgeProps>
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: (index: number) => void
}
