import { cn } from '../theme/cn'
import { createNamespace, getSizeStyle } from '../utils'
import type { SkeletonAvatarProps } from './types'

const bem = createNamespace('skeleton-avatar')

export function SkeletonAvatar(props: SkeletonAvatarProps) {
  const { avatarSize, avatarShape = 'round', className } = props
  return (
    <view
      className={cn(bem({ [avatarShape]: true }), className)}
      style={getSizeStyle(avatarSize)}
    />
  )
}

export type { SkeletonAvatarProps, SkeletonAvatarShape } from './types'
