import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface StepperProps {
  value?: number | string
  defaultValue?: number | string
  min?: number | string
  max?: number | string
  step?: number | string
  integer?: boolean
  disabled?: boolean
  disableInput?: boolean
  inputWidth?: Numeric
  buttonSize?: Numeric
  theme?: 'default' | 'round'
  allowEmpty?: boolean
  decimalLength?: number
  className?: string
  style?: CSSProperties
  onChange?: (value: number | string) => void
  onOverlimit?: (
    action: 'plus' | 'minus',
    value: number | string,
  ) => void
  onPlus?: () => void
  onMinus?: () => void
}
