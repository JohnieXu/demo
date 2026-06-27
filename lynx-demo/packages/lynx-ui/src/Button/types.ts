import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  label?: string
  onClick?: () => void
  children?: ReactNode
  style?: CSSProperties
  textStyle?: CSSProperties
  disabled?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}
