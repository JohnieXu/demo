import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface NavBarProps {
  title?: ReactNode
  fixed?: boolean
  border?: boolean
  zIndex?: Numeric
  leftText?: string
  rightText?: string
  leftArrow?: boolean
  leftDisabled?: boolean
  rightDisabled?: boolean
  safeAreaInsetTop?: boolean
  placeholder?: boolean
  leftChildren?: ReactNode
  rightChildren?: ReactNode
  className?: string
  style?: CSSProperties
  onClickLeft?: () => void
  onClickRight?: () => void
}
