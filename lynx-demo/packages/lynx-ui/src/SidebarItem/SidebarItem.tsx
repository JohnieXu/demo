import { useContext } from '@lynx-js/react'
import { Badge } from '../Badge'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import { SidebarContext, SidebarIndexContext } from '../Sidebar/Sidebar'
import type { SidebarItemProps } from './types'

const bem = createNamespace('sidebar-item')

export function SidebarItem(props: SidebarItemProps) {
  const {
    dot,
    title,
    badge,
    disabled = false,
    badgeProps,
    children,
    className,
    style,
    onClick,
  } = props

  const index = useContext(SidebarIndexContext)
  const { active, setActive } = useContext(SidebarContext)
  const selected = index === active

  const handleTap = () => {
    if (disabled) return
    onClick?.(index)
    setActive(index)
  }

  return (
    <view
      className={cn(
        bem({
          select: selected,
          disabled,
        }),
        className,
      )}
      style={style}
      bindtap={handleTap}
    >
      <Badge
        dot={dot}
        content={badge}
        className={bem('text')}
        {...badgeProps}
      >
        {children ?? title}
      </Badge>
      {selected && <view className={bem('indicator')} />}
    </view>
  )
}

export type { SidebarItemProps } from './types'
