export type SkeletonAvatarShape = 'square' | 'round'

export interface SkeletonAvatarProps {
  avatarSize?: number | string
  avatarShape?: SkeletonAvatarShape
  className?: string
}
