import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export type SpaceSize = number | string
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline'
export type SpaceDirection = 'vertical' | 'horizontal'

export interface SpaceProps {
  align?: SpaceAlign
  direction?: SpaceDirection
  size?: SpaceSize | [SpaceSize, SpaceSize]
  wrap?: boolean
  fill?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}
