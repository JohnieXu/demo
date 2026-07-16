import { Icon } from '../Icon'
import { icons } from '../Icon/icons'
import { cn } from '../theme/cn'
import { createNamespace, getSizeStyle } from '../utils'
import type { SkeletonImageProps } from './types'

const bem = createNamespace('skeleton-image')

export function SkeletonImage(props: SkeletonImageProps) {
  const { imageSize, imageShape = 'square', className } = props
  return (
    <view
      className={cn(bem({ [imageShape]: true }), className)}
      style={getSizeStyle(imageSize)}
    >
      <Icon svg={icons.photo} className={bem('icon')} />
    </view>
  )
}

export type { SkeletonImageProps, SkeletonImageShape } from './types'
