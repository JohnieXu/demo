import { useCallback, useContext, useEffect, useRef, useState } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'
import { Badge } from '../Badge'
import { Icon } from '../Icon'
import { ActionBarContext } from '../ActionBar/context'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { ActionBarIconProps } from './types'

const bem = createNamespace('action-bar-icon')

export function ActionBarIcon(props: ActionBarIconProps) {
  const {
    icon,
    text,
    color,
    dot,
    badge,
    onClick,
    className,
    style,
  } = props

  const { register, itemsRef } = useContext(ActionBarContext)
  const [, setTick] = useState(0)
  const forceUpdate = useCallback(() => setTick((t) => t + 1), [])
  const indexRef = useRef<number | null>(null)

  useEffect(() => {
    const idx = register(false)
    const items = itemsRef.current
    indexRef.current = idx
    forceUpdate()
    return () => {
      if (idx !== null) {
        items[idx] = { isButton: false }
      }
    }
  }, [register, itemsRef, forceUpdate])

  const index = indexRef.current
  const prev = index !== null ? itemsRef.current[index - 1] : undefined
  const next = index !== null ? itemsRef.current[index + 1] : undefined
  const isFirst = index !== null && !(prev && prev.isButton)
  const isLast = index !== null && !(next && next.isButton)

  const renderIcon = (): ReactNode => {
    const iconNode = typeof icon === 'string' ? <Icon svg={icon} className={bem('icon')} /> : icon

    if (dot || badge !== undefined) {
      return (
        <Badge dot={dot} content={badge}>
          {iconNode}
        </Badge>
      )
    }

    return iconNode
  }

  return (
    <view
      className={cn(bem({ first: isFirst, last: isLast }), className)}
      style={style}
      bindtap={onClick}
    >
      {renderIcon()}
      {text && (
        <text className={bem('text')} style={{ color }}>{text}</text>
      )}
    </view>
  )
}
