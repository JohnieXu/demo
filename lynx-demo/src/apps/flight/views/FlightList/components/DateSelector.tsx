import { useMemo } from '@lynx-js/react'
import { clsx } from 'clsx'
import './DateSelector.scss'

export interface DateItem {
  key: string
  weekText: string
  dayText: string
  fullDayText: string
  dateStr: string
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function getWeekText(date: Date, offset: number): string {
  if (offset === 0) return '今天'
  if (offset === 1) return '明天'
  if (offset === 2) return '后天'
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weeks[date.getDay()]
}

function generateDateList(): DateItem[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const list: DateItem[] = []

  for (let i = 0; i < 15; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const dateStr = `${d.getFullYear()}-${month}-${day}`

    list.push({
      key: formatDateKey(d),
      weekText: getWeekText(d, i),
      dayText: day,
      fullDayText: `${month}-${day}`,
      dateStr,
    })
  }

  return list
}

interface DateSelectorProps {
  selectedDate: string
  onChange: (date: string) => void
}

export function DateSelector({ selectedDate, onChange }: DateSelectorProps) {
  const dateList = useMemo(() => generateDateList(), [])

  return (
    <view className="date-selector">
      <scroll-view
        className="date-selector__scroll"
        scroll-orientation="horizontal"
        show-scroll-bar={false}
      >
        {dateList.map((item) => (
          <view
            key={item.key}
            className={clsx(
              'date-selector__item',
              item.key === selectedDate && 'date-selector__item--active'
            )}
            bindtap={() => onChange(item.key)}
          >
            <text className="date-selector__week">{item.weekText}</text>
            <text className="date-selector__day">
              {item.key === selectedDate ? item.fullDayText : item.dayText}
            </text>
          </view>
        ))}
      </scroll-view>
    </view>
  )
}
