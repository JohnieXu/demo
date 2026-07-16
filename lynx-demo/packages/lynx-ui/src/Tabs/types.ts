import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface TabsProps {
  active?: string | number
  defaultActive?: string | number
  type?: 'line' | 'card'
  color?: string
  background?: string
  lineWidth?: string | number
  lineHeight?: string | number
  animated?: boolean
  sticky?: boolean
  onChange?: (name: string | number, title: string) => void
  className?: string
  style?: CSSProperties
  children?: ReactNode
}
