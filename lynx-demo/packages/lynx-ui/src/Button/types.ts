import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonType = 'default' | 'primary' | 'success' | 'danger' | 'warning'

export interface ButtonProps {
  /** Vant-like button type. Defaults to `'default'` when neither `type` nor `variant` is provided. */
  type?: ButtonType
  /** Custom color, supports solid colors and `linear-gradient(...)`. */
  color?: string
  plain?: boolean
  round?: boolean
  square?: boolean
  block?: boolean
  loading?: boolean
  loadingText?: string
  /** Icon rendered on the left side of the text. */
  icon?: ReactNode
  /** Alias of `label`, kept for Vant-style API. */
  text?: string

  label?: string
  onClick?: () => void
  children?: ReactNode
  style?: CSSProperties
  textStyle?: CSSProperties
  disabled?: boolean
  /** Legacy prop, kept for backwards compatibility. `type` takes precedence when both are set. */
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}
