import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export type StepsDirection = 'horizontal' | 'vertical'

export interface StepsProps {
  active?: number
  defaultActive?: number
  direction?: StepsDirection
  activeColor?: string
  inactiveColor?: string
  activeIcon?: ReactNode
  inactiveIcon?: ReactNode
  clickable?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClickStep?: (index: number) => void
}
