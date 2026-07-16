import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { BadgeProps } from '../Badge'
import type { Numeric } from '../utils'

export interface TabbarItemProps {
  dot?: boolean
  icon?: string
  name?: Numeric
  badge?: Numeric
  badgeProps?: Partial<BadgeProps>
  iconSize?: Numeric
  renderIcon?: (active: boolean) => ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: (index: number) => void
}
