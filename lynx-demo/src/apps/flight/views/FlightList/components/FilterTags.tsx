import { clsx } from 'clsx'
import './FilterTags.scss'

export interface FilterLabelItem {
  label: string
  value: string
}

interface FilterTagsProps {
  labels: FilterLabelItem[]
  selectedLabels: string[]
  onChange: (selectedValues: string[]) => void
  loading?: boolean
  nodata?: boolean
}

export function FilterTags({
  labels,
  selectedLabels,
  onChange,
  loading,
  nodata,
}: FilterTagsProps) {
  if (loading || nodata || !labels.length) {
    return null
  }

  const toggleLabel = (value: string) => {
    const set = new Set(selectedLabels)
    if (set.has(value)) {
      set.delete(value)
    } else {
      set.add(value)
    }
    onChange(Array.from(set))
  }

  return (
    <view className="filter-tags">
      <scroll-view
        className="filter-tags__scroll"
        scroll-orientation="horizontal"
        show-scroll-bar={false}
      >
        {labels.map((item) => (
          <view
            key={item.value}
            className={clsx(
              'filter-tags__item',
              selectedLabels.includes(item.value) &&
                'filter-tags__item--active'
            )}
            bindtap={() => toggleLabel(item.value)}
          >
            <text className="filter-tags__text">{item.label}</text>
          </view>
        ))}
      </scroll-view>
    </view>
  )
}
