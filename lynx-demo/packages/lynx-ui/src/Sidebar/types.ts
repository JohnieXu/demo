import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface SidebarProps {
  active?: Numeric
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onChange?: (value: number) => void
  onUpdateActive?: (value: number) => void
}
