import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export type TagType =
  | 'default'
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'

export type TagSize = 'large' | 'medium' | 'small'

export interface TagProps {
  size?: TagSize
  mark?: boolean
  show?: boolean
  type?: TagType
  color?: string
  plain?: boolean
  round?: boolean
  textColor?: string
  closeable?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClose?: () => void
}
