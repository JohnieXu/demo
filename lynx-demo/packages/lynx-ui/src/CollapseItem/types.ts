import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface CollapseItemProps {
  name: Numeric
  title?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  readonly?: boolean
  isLink?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onChange?: (expanded: boolean) => void
  onClickTitle?: () => void
}
