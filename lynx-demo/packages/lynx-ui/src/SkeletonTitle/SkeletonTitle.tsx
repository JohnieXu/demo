import { cn } from '../theme/cn'
import { addUnit, createNamespace } from '../utils'
import type { SkeletonTitleProps } from './types'

const bem = createNamespace('skeleton-title')

export function SkeletonTitle(props: SkeletonTitleProps) {
  const { round, titleWidth, className } = props
  return (
    <view
      className={cn(bem({ round: !!round }), className)}
      style={{ width: addUnit(titleWidth) }}
    />
  )
}

export type { SkeletonTitleProps } from './types'
