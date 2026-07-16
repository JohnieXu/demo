import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface ActionBarChild {
  isButton: boolean
}

export interface ActionBarContextValue {
  index: number
  itemsRef: { current: ActionBarChild[] }
  register: (isButton: boolean) => number
}

export interface ActionBarProps {
  placeholder?: boolean
  safeAreaInsetBottom?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
