import { clsx } from 'clsx'
import type { SortType, SortOrder } from 'travel-domain'
import './SortBar.scss'

interface SortBarProps {
  sortType: SortType
  sortOrder: SortOrder
  filterCount: number
  onSortChange: (sortType: SortType) => void
  onFilterClick: () => void
}

const sortItems: { key: SortType; label: string }[] = [
  { key: 1, label: '优先直飞' },
  { key: 2, label: '时间排序' },
  { key: 3, label: '价格排序' },
]

export function SortBar({
  sortType,
  sortOrder,
  filterCount,
  onSortChange,
  onFilterClick,
}: SortBarProps) {
  return (
    <view className="sort-bar">
      <view className="sort-bar__item" bindtap={onFilterClick}>
        <text className="sort-bar__icon">☰</text>
        <text className="sort-bar__label">筛选</text>
        {filterCount > 0 && (
          <view className="sort-bar__badge">
            <text className="sort-bar__badge-text">{filterCount}</text>
          </view>
        )}
      </view>
      {sortItems.map((item) => (
        <view
          key={item.key}
          className={clsx(
            'sort-bar__item',
            sortType === item.key && 'sort-bar__item--active'
          )}
          bindtap={() => onSortChange(item.key)}
        >
          <text className="sort-bar__label">{item.label}</text>
          {item.key !== 1 && sortType === item.key && (
            <text className="sort-bar__arrow">
              {sortOrder === 1 ? '↑' : '↓'}
            </text>
          )}
        </view>
      ))}
    </view>
  )
}
