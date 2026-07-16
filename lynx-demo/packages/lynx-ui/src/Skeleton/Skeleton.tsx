import { cn } from '../theme/cn'
import { addUnit, createNamespace, isDef } from '../utils'
import type { Numeric } from '../utils'
import { SkeletonAvatar } from '../SkeletonAvatar'
import { SkeletonParagraph, DEFAULT_ROW_WIDTH } from '../SkeletonParagraph'
import { SkeletonTitle } from '../SkeletonTitle'
import type { SkeletonProps } from './types'

const bem = createNamespace('skeleton')
const DEFAULT_LAST_ROW_WIDTH = '60%'

function toNumber(val?: Numeric): number {
  if (!isDef(val)) return 0
  const num = Number(val)
  return Number.isNaN(num) ? 0 : num
}

export function Skeleton(props: SkeletonProps) {
  const {
    row = 0,
    round = false,
    title = false,
    titleWidth,
    avatar = false,
    avatarSize,
    avatarShape = 'round',
    loading = true,
    animate = true,
    rowWidth = DEFAULT_ROW_WIDTH,
    children,
    template,
    className,
    style,
  } = props

  if (!loading) {
    return <>{children}</>
  }

  const rowCount = toNumber(row)

  const getRowWidth = (index: number): string | number | undefined => {
    if (rowWidth === DEFAULT_ROW_WIDTH && index === rowCount - 1) {
      return DEFAULT_LAST_ROW_WIDTH
    }
    if (Array.isArray(rowWidth)) {
      return rowWidth[index]
    }
    return rowWidth
  }

  const renderRows = () =>
    Array.from({ length: rowCount }, (_, i) => (
      <SkeletonParagraph
        key={i}
        round={round}
        rowWidth={addUnit(getRowWidth(i))}
      />
    ))

  return (
    <view
      className={cn(bem({ animate, round }), className)}
      style={style}
    >
      {template ? (
        template
      ) : (
        <>
          {avatar && (
            <SkeletonAvatar
              avatarShape={avatarShape}
              avatarSize={avatarSize}
            />
          )}
          <view className={bem('content')}>
            {title && <SkeletonTitle round={round} titleWidth={titleWidth} />}
            {renderRows()}
          </view>
        </>
      )}
    </view>
  )
}

export type { SkeletonProps } from './types'
