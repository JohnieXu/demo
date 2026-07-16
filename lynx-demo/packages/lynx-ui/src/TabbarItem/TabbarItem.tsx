import { useContext } from '@lynx-js/react'
import { Badge } from '../Badge'
import { Icon } from '../Icon'
import { icons } from '../Icon/icons'
import { cn } from '../theme/cn'
import { createNamespace, isDef } from '../utils'
import { TabbarContext, TabbarIndexContext } from '../Tabbar/Tabbar'
import type { TabbarItemProps } from './types'

const bem = createNamespace('tabbar-item')

function resolveIconSvg(name?: string): string {
  if (!name) return ''
  if (name.startsWith('<')) return name
  return icons[name] || ''
}

export function TabbarItem(props: TabbarItemProps) {
  const {
    dot,
    icon,
    name,
    badge,
    badgeProps,
    iconSize = 22,
    renderIcon,
    children,
    className,
    style,
    onClick,
  } = props

  const index = useContext(TabbarIndexContext)
  const { active, setActive, activeColor, inactiveColor } = useContext(TabbarContext)

  const itemName = isDef(name) ? name : index
  const isActive = itemName === active

  const color = isActive ? activeColor : inactiveColor

  const handleTap = () => {
    onClick?.(index)
    setActive(itemName)
  }

  const renderIconNode = () => {
    if (renderIcon) {
      return renderIcon(isActive)
    }
    if (icon) {
      return (
        <Icon
          svg={resolveIconSvg(icon)}
          size={iconSize}
          className={bem('icon')}
        />
      )
    }
    return null
  }

  return (
    <view
      className={cn(
        bem({ active: isActive }),
        className,
      )}
      style={{ color, ...style }}
      bindtap={handleTap}
    >
      <Badge
        dot={dot}
        content={badge}
        className={bem('icon-wrap')}
        {...badgeProps}
      >
        {renderIconNode()}
      </Badge>
      {children && (
        <text className={bem('text')}>{children}</text>
      )}
    </view>
  )
}

export type { TabbarItemProps } from './types'
