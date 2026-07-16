import { useContext, useState } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import { CollapseContext } from '../Collapse/context'
import type { CollapseItemProps } from './types'

const bem = createNamespace('collapse-item')

export function CollapseItem(props: CollapseItemProps) {
  const {
    name,
    title,
    icon,
    disabled = false,
    readonly = false,
    isLink = true,
    children,
    className,
    style,
    onChange,
    onClickTitle,
  } = props

  const ctx = useContext(CollapseContext)
  if (!ctx) {
    throw new Error('CollapseItem must be a child of Collapse')
  }

  const expanded = ctx.expandedNames.includes(name)
  const [internalExpanded, setInternalExpanded] = useState(false)
  const actualExpanded = ctx.expandedNames.length > 0 ? expanded : internalExpanded

  const toggle = () => {
    if (disabled || readonly) return
    const next = !actualExpanded
    ctx.toggle(name, !actualExpanded)
    if (!ctx.expandedNames.length) setInternalExpanded(next)
    onChange?.(next)
  }

  return (
    <view
      className={cn(
        bem({ disabled, expanded: actualExpanded }),
        className,
      )}
      style={style}
    >
      <view
        className={bem('title', {
          disabled,
          expanded: actualExpanded,
        })}
        bindtap={() => {
          toggle()
          onClickTitle?.()
        }}
      >
        {icon != null && <view className={bem('icon')}>{icon}</view>}
        <view className={bem('title-text')}>
          {typeof title === 'string' || typeof title === 'number' ? (
            <text>{title}</text>
          ) : (
            title
          )}
        </view>
        {isLink && (
          <view className={bem('arrow', { expanded: actualExpanded })}>
            <view className={bem('arrow-icon')} />
          </view>
        )}
      </view>
      {actualExpanded && (
        <view className={bem('content')}>{children}</view>
      )}
    </view>
  )
}

export type { CollapseItemProps } from './types'
