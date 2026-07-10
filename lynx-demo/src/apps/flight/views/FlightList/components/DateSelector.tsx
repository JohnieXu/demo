import { useMemo } from '@lynx-js/react'
import { clsx } from 'clsx'
import dayjs from '../../../utils/dayjs'
import { WEEKDAYS } from '../../../utils/date'
import './DateSelector.scss'

export interface DateItem {
  key: string
  weekText: string
  dayText: string
  fullDayText: string
  dateStr: string
}

function formatDateKey(date: dayjs.Dayjs): string {
  return date.format('YYYYMMDD')
}

function getWeekText(date: dayjs.Dayjs, offset: number): string {
  if (offset === 0) return '今天'
  if (offset === 1) return '明天'
  if (offset === 2) return '后天'
  return WEEKDAYS[date.day()]
}

function generateDateList(): DateItem[] {
  const today = dayjs()
  const list: DateItem[] = []

  for (let i = 0; i < 15; i++) {
    const d = today.add(i, 'day')

    list.push({
      key: formatDateKey(d),
      weekText: getWeekText(d, i),
      dayText: d.format('DD'),
      fullDayText: d.format('MM-DD'),
      dateStr: d.format('YYYY-MM-DD'),
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
