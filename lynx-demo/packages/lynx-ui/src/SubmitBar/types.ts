import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { ButtonType } from '../Button'

export type SubmitBarTextAlign = 'left' | 'right'

export interface SubmitBarProps {
  /** Tip message shown above the bar. */
  tip?: string
  /** Price label text. */
  label?: string
  /** Price amount in cents. */
  price?: number
  /** SVG source string for the tip icon. */
  tipIcon?: string
  /** Whether the submit button is in loading state. */
  loading?: boolean
  /** Currency symbol placed before the price. */
  currency?: string
  /** Whether the submit button is disabled. */
  disabled?: boolean
  /** Alignment of the price text area. */
  textAlign?: SubmitBarTextAlign
  /** Text of the submit button. */
  buttonText?: string
  /** Type of the submit button. */
  buttonType?: ButtonType
  /** Custom color of the submit button. */
  buttonColor?: string
  /** Suffix label shown after the price. */
  suffixLabel?: string
  /** Whether to render a placeholder view with the same height as the bar. */
  placeholder?: boolean
  /** Number of decimal digits for the price. */
  decimalLength?: number | string
  /** Whether to add safe-area inset padding at the bottom. */
  safeAreaInsetBottom?: boolean
  /** Callback when the submit button is clicked. */
  onSubmit?: () => void
  /** Extra class names. */
  className?: string
  /** Inline styles. */
  style?: CSSProperties
  /** Default slot content rendered inside the bar, before the price text. */
  children?: ReactNode
}
