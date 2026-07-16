import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export interface CardProps {
  tag?: string
  num?: Numeric
  desc?: string
  thumb?: string
  title?: string
  price?: Numeric
  centered?: boolean
  lazyLoad?: boolean
  currency?: string
  thumbLink?: string
  originPrice?: Numeric
  // named slot replacements
  titleSlot?: ReactNode
  thumbSlot?: ReactNode
  tagSlot?: ReactNode
  descSlot?: ReactNode
  tags?: ReactNode
  priceSlot?: ReactNode
  originPriceSlot?: ReactNode
  numSlot?: ReactNode
  bottomSlot?: ReactNode
  priceTopSlot?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClickThumb?: () => void
}
