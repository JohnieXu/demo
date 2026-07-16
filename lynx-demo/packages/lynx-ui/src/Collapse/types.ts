import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface CollapseProps {
  value?: Numeric | Numeric[]
  defaultValue?: Numeric | Numeric[]
  accordion?: boolean
  border?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onChange?: (value: Numeric | Numeric[]) => void
}
