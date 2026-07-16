import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { SkeletonAvatarShape } from '../SkeletonAvatar'
import type { Numeric } from '../utils'

export interface SkeletonProps {
  row?: Numeric
  round?: boolean
  title?: boolean
  titleWidth?: Numeric
  avatar?: boolean
  avatarSize?: Numeric
  avatarShape?: SkeletonAvatarShape
  loading?: boolean
  animate?: boolean
  rowWidth?: Numeric | Numeric[]
  children?: ReactNode
  template?: ReactNode
  className?: string
  style?: CSSProperties
}
