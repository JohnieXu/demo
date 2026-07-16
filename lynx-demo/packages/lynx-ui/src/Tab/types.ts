import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface TabProps {
  title: string
  name?: string | number
  disabled?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
