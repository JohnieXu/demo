import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import { DEFAULT_ROW_WIDTH } from './types'
import type { SkeletonParagraphProps } from './types'

const bem = createNamespace('skeleton-paragraph')

export function SkeletonParagraph(props: SkeletonParagraphProps) {
  const { round, rowWidth = DEFAULT_ROW_WIDTH, className } = props
  return (
    <view
      className={cn(bem({ round: !!round }), className)}
      style={{ width: rowWidth }}
    />
  )
}

export { DEFAULT_ROW_WIDTH }
export type { SkeletonParagraphProps } from './types'
