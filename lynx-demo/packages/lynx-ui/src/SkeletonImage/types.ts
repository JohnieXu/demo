export type SkeletonImageShape = 'square' | 'round'

export interface SkeletonImageProps {
  imageSize?: number | string
  imageShape?: SkeletonImageShape
  className?: string
}
