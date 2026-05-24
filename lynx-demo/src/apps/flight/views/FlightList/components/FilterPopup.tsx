import { useState } from '@lynx-js/react'
import { clsx } from 'clsx'
import type { FilterState, FilterOption, TimeRangeOption } from '../hooks/useFlightFilter'
import './FilterPopup.scss'

interface FilterPopupProps {
  show: boolean
  tabs: { key: string; label: string }[]
  featuredOptions: FilterOption[]
  timeRangeOptions: TimeRangeOption[]
  depAirportOptions: FilterOption[]
  arrAirportOptions: FilterOption[]
  airlineOptions: FilterOption[]
  modelOptions: FilterOption[]
  filters: FilterState
  previewCount: number
  previewLoading: boolean
  onClose: () => void
  onReset: () => void
  onConfirm: () => void
  onChange: (filters: Partial<FilterState>) => void
}

export function FilterPopup({
  show,
  tabs,
  featuredOptions,
  timeRangeOptions,
  depAirportOptions,
  arrAirportOptions,
  airlineOptions,
  modelOptions,
  filters,
  previewCount,
  previewLoading,
  onClose,
  onReset,
  onConfirm,
  onChange,
}: FilterPopupProps) {
  const [activeTab, setActiveTab] = useState('featured')

  if (!show) return null

  const toggleArrayValue = (key: keyof FilterState, value: string) => {
    const current = filters[key] as string[]
    const set = new Set(current)
    if (set.has(value)) {
      set.delete(value)
    } else {
      set.add(value)
    }
    onChange({ [key]: Array.from(set) } as Partial<FilterState>)
  }

  const renderOptions = (options: FilterOption[], key: keyof FilterState) => (
    <view className="filter-popup__options">
      {options.map((option) => (
        <view
          key={option.value}
          className={clsx(
            'filter-popup__option',
            (filters[key] as string[]).includes(option.value) &&
              'filter-popup__option--active'
          )}
          bindtap={() => toggleArrayValue(key, option.value)}
        >
          <text className="filter-popup__option-text">{option.label}</text>
        </view>
      ))}
    </view>
  )

  const renderTimeOptions = (options: TimeRangeOption[], key: keyof FilterState) => (
    <view className="filter-popup__options">
      {options.map((option) => (
        <view
          key={option.key}
          className={clsx(
            'filter-popup__option',
            (filters[key] as string[]).includes(option.key) &&
              'filter-popup__option--active'
          )}
          bindtap={() => toggleArrayValue(key, option.key)}
        >
          <text className="filter-popup__option-text">{option.label}</text>
        </view>
      ))}
    </view>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'featured':
        return renderOptions(featuredOptions, 'featured')
      case 'time':
        return (
          <view>
            <text className="filter-popup__section-title">出发时间</text>
            {renderTimeOptions(timeRangeOptions, 'depTimeRanges')}
            <text className="filter-popup__section-title">到达时间</text>
            {renderTimeOptions(timeRangeOptions, 'arrTimeRanges')}
          </view>
        )
      case 'airport':
        return (
          <view>
            <text className="filter-popup__section-title">出发机场</text>
            {renderOptions(depAirportOptions, 'depAirports')}
            <text className="filter-popup__section-title">到达机场</text>
            {renderOptions(arrAirportOptions, 'arrAirports')}
          </view>
        )
      case 'airline':
        return renderOptions(airlineOptions, 'airlines')
      case 'model':
        return renderOptions(modelOptions, 'models')
      default:
        return null
    }
  }

  return (
    <view className="filter-popup">
      <view className="filter-popup__overlay" bindtap={onClose} />
      <view className="filter-popup__content">
        <view className="filter-popup__header">
          <text className="filter-popup__title">筛选</text>
          <text className="filter-popup__close" bindtap={onClose}>✕</text>
        </view>

        <view className="filter-popup__body">
          <view className="filter-popup__tabs">
            {tabs.map((tab) => (
              <view
                key={tab.key}
                className={clsx(
                  'filter-popup__tab',
                  activeTab === tab.key && 'filter-popup__tab--active'
                )}
                bindtap={() => setActiveTab(tab.key)}
              >
                <text className="filter-popup__tab-text">{tab.label}</text>
              </view>
            ))}
          </view>

          <view className="filter-popup__panel">
            {renderContent()}
          </view>
        </view>

        <view className="filter-popup__footer">
          <view className="filter-popup__reset" bindtap={onReset}>
            <text className="filter-popup__reset-text">重置</text>
          </view>
          <view className="filter-popup__confirm" bindtap={onConfirm}>
            <text className="filter-popup__confirm-text">
              {previewLoading ? '加载中...' : `查看结果${previewCount > 0 ? ` (${previewCount})` : ''}`}
            </text>
          </view>
        </view>
      </view>
    </view>
  )
}
