import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface StepProps {
  activeIcon?: ReactNode
  inactiveIcon?: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
