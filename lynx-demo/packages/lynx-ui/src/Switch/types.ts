import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface SwitchProps {
  size?: Numeric
  loading?: boolean
  disabled?: boolean
  checked?: boolean
  defaultChecked?: boolean
  activeColor?: string
  inactiveColor?: string
  activeValue?: unknown
  inactiveValue?: unknown
  name?: string
  className?: string
  style?: CSSProperties
  onChange?: (checked: boolean) => void
}
