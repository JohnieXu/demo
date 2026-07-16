import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { CellGroupProps } from './types'

const bem = createNamespace('cell-group')

export function CellGroup(props: CellGroupProps) {
  const {
    title,
    inset = false,
    border = true,
    children,
    className,
    style,
  } = props

  const renderTitle = () => {
    if (title == null) return null
    return (
      <view className={bem('title', { inset })}>
        <text>{title}</text>
      </view>
    )
  }

  const renderGroup = () => (
    <view
      className={cn(
        bem({ inset, border: border && !inset }),
        className,
      )}
      style={style}
    >
      {children}
    </view>
  )

  if (title != null) {
    return (
      <view>
        {renderTitle()}
        {renderGroup()}
      </view>
    )
  }

  return renderGroup()
}

export type { CellGroupProps } from './types'
