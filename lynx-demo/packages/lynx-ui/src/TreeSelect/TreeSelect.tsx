import { Icon } from '../Icon'
import { icons } from '../Icon/icons'
import { Sidebar } from '../Sidebar'
import { SidebarItem } from '../SidebarItem'
import { cn } from '../theme/cn'
import { addUnit, createNamespace } from '../utils'
import type { Numeric } from '../utils'
import type { TreeSelectProps, TreeSelectItem, TreeSelectChild } from './types'

export type { TreeSelectItem, TreeSelectChild }

const bem = createNamespace('tree-select')

function resolveIconSvg(name?: string): string {
  if (!name) return ''
  if (name.startsWith('<')) return name
  return icons[name] || ''
}

function isActiveItem(activeId: Numeric | Numeric[] | undefined, id: Numeric): boolean {
  if (activeId === undefined) return false
  if (Array.isArray(activeId)) return activeId.includes(id)
  return activeId === id
}

export function TreeSelect(props: TreeSelectProps) {
  const {
    items = [],
    height = 300,
    max = Infinity,
    selectedIcon = 'success',
    mainActiveIndex = 0,
    activeId = 0,
    renderNavText,
    children,
    className,
    style,
    onClickNav,
    onClickItem,
    onUpdateMainActiveIndex,
    onUpdateActiveId,
  } = props

  const currentIndex = Math.max(0, Math.min(+mainActiveIndex, items.length - 1))
  const selected = items[currentIndex]

  const handleNavChange = (index: number) => {
    onUpdateMainActiveIndex?.(index)
    onClickNav?.(index)
  }

  const handleItemClick = (item: TreeSelectChild) => {
    if (item.disabled) return

    let nextActiveId: Numeric | Numeric[]
    if (Array.isArray(activeId)) {
      const list = activeId.slice()
      const index = list.indexOf(item.id)
      if (index !== -1) {
        list.splice(index, 1)
      } else if (list.length < +max) {
        list.push(item.id)
      }
      nextActiveId = list
    } else {
      nextActiveId = item.id
    }

    onUpdateActiveId?.(nextActiveId)
    onClickItem?.(item)
  }

  const renderContent = () => {
    if (children) return children
    if (!selected?.children) return null
    return selected.children.map((item) => (
      <view
        key={String(item.id)}
        className={cn(
          'lu-ellipsis',
          bem('item', {
            active: isActiveItem(activeId, item.id),
            disabled: !!item.disabled,
          }),
        )}
        bindtap={() => handleItemClick(item)}
      >
        <text>{item.text}</text>
        {isActiveItem(activeId, item.id) && (
          <Icon
            svg={resolveIconSvg(selectedIcon)}
            className={bem('selected')}
          />
        )}
      </view>
    ))
  }

  return (
    <view
      className={cn(bem(), className)}
      style={{ height: addUnit(height), ...style }}
    >
      <Sidebar
        active={currentIndex}
        onChange={handleNavChange}
        className={bem('nav')}
      >
        {items.map((item) => (
          <SidebarItem
            key={item.text}
            dot={item.dot}
            badge={item.badge}
            disabled={item.disabled}
          >
            {renderNavText ? renderNavText(item) : item.text}
          </SidebarItem>
        ))}
      </Sidebar>
      <view className={bem('content')}>{renderContent()}</view>
    </view>
  )
}

export type { TreeSelectProps } from './types'
