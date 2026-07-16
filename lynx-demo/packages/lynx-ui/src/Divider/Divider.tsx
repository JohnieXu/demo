import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { DividerProps } from './types'

const bem = createNamespace('divider')

export function Divider(props: DividerProps) {
  const {
    dashed = false,
    vertical = false,
    contentPosition = 'center',
    children,
    className,
    style,
  } = props

  if (vertical) {
    return (
      <view
        className={cn(bem({ vertical: true }), className)}
        style={style}
      />
    )
  }

  const hasContent = children != null

  return (
    <view
      className={cn(
        bem({
          [`content-${contentPosition}`]: hasContent,
        }),
        className,
      )}
      style={style}
    >
      <view className={cn(bem('line'), bem('line--left'), dashed && bem('line--dashed'))} />
      {hasContent && (
        <text className={bem('content')}>{children}</text>
      )}
      <view className={cn(bem('line'), bem('line--right'), dashed && bem('line--dashed'))} />
    </view>
  )
}

export type { DividerProps, DividerContentPosition } from './types'
