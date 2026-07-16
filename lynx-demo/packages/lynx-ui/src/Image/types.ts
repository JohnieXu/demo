import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
export type ImagePosition =
  | 'top'
  | 'bottom'
  | 'center'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export interface ImageProps {
  src?: string
  alt?: string
  fit?: ImageFit
  position?: ImagePosition
  round?: boolean
  block?: boolean
  width?: Numeric
  height?: Numeric
  radius?: Numeric
  iconSize?: Numeric
  showError?: boolean
  showLoading?: boolean
  errorContent?: ReactNode
  loadingContent?: ReactNode
  className?: string
  style?: CSSProperties
  children?: ReactNode
  onLoad?: () => void
  onError?: () => void
}
