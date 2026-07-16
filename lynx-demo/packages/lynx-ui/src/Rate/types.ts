import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface RateProps {
  /** Current value (controlled). */
  value?: number
  /** Default value (uncontrolled). */
  defaultValue?: number
  /** Number of stars. Defaults to `5`. */
  count?: number
  /** Size of each star. Accepts a number (px) or any CSS length. Defaults to `20px`. */
  size?: Numeric
  /** Gap between stars. Accepts a number (px) or any CSS length. Defaults to `4px`. */
  gutter?: Numeric
  /** Color of active stars. Defaults to `--lu-rate-color` (mapped to `--lu-color-warning`). */
  color?: string
  /** Color of inactive stars. Defaults to `--lu-rate-void-color` (mapped to `--lu-color-border`). */
  voidColor?: string
  /** SVG source for active stars. Defaults to a filled star. */
  icon?: string
  /** SVG source for inactive stars. Defaults to an outlined star. */
  voidIcon?: string
  /** Allow selecting half stars. */
  allowHalf?: boolean
  /** Read-only; no interaction. */
  readonly?: boolean
  /** Disabled; no interaction. */
  disabled?: boolean
  /** Callback when the value changes. */
  onChange?: (value: number) => void
  className?: string
  style?: CSSProperties
}
