import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { ButtonType } from '../Button'

export interface ActionBarButtonProps {
  type?: ButtonType
  text?: string
  icon?: ReactNode
  color?: string
  loading?: boolean
  disabled?: boolean
  children?: ReactNode
  onClick?: () => void
  className?: string
  style?: CSSProperties
}
