import { useEffect, useMemo } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { CALENDAR_DEFAULTS, CALENDAR_TEXTS } from './constants'
import { CalendarDay } from './CalendarDay'
import type { CalendarDayItem, CalendarDayType, CalendarMonthProps } from './types'
import {
  compareDay,
  formatMonthTitle,
  getMonthDayOffset,
  getMonthEndDay,
  getNextDay,
  getPrevDay,
  parseSize,
} from './utils'

export function CalendarMonth(props: CalendarMonthProps) {
  const {
    date,
    type = 'single',
    color,
    minDate,
    maxDate,
    showMark = true,
    rowHeight = CALENDAR_DEFAULTS.dayHeight,
    formatter,
    lazyRender = true,
    visible = true,
    currentDate,
    allowSameDay,
    showMonthTitle = true,
    firstDayOfWeek = 0,
    onClick,
    onClickDisabledDate,
    onDisabledDaysChange,
    renderMonthTitle,
    renderTopInfo,
    renderBottomInfo,
    renderDayText,
  } = props

  const title = useMemo(() => formatMonthTitle(date), [date])
  const offset = useMemo(() => getMonthDayOffset(date, firstDayOfWeek), [date, firstDayOfWeek])
  const totalDay = useMemo(
    () => getMonthEndDay(date.getFullYear(), date.getMonth() + 1),
    [date],
  )

  const shouldRender = visible || !lazyRender

  const placeholders = useMemo<CalendarDayItem[]>(() => {
    const count = Math.ceil((totalDay + offset) / 7)
    return Array.from({ length: count }, () => ({ type: 'placeholder' }))
  }, [totalDay, offset])

  const days = useMemo<CalendarDayItem[]>(() => {
    const getMultipleDayType = (day: Date): CalendarDayType => {
      if (!Array.isArray(currentDate)) return ''

      const isSelected = (d: Date) =>
        currentDate.some((item) => compareDay(item, d) === 0)

      if (isSelected(day)) {
        const prevDay = getPrevDay(day)
        const nextDay = getNextDay(day)
        const prevSelected = isSelected(prevDay)
        const nextSelected = isSelected(nextDay)

        if (prevSelected && nextSelected) return 'multiple-middle'
        if (prevSelected) return 'end'
        if (nextSelected) return 'start'
        return 'multiple-selected'
      }

      return ''
    }

    const getRangeDayType = (day: Date): CalendarDayType => {
      if (!Array.isArray(currentDate)) return ''
      const [startDay, endDay] = currentDate

      if (!startDay) return ''

      const compareToStart = compareDay(day, startDay)

      if (!endDay) {
        return compareToStart === 0 ? 'start' : ''
      }

      const compareToEnd = compareDay(day, endDay)

      if (allowSameDay && compareToStart === 0 && compareToEnd === 0) {
        return 'start-end'
      }
      if (compareToStart === 0) return 'start'
      if (compareToEnd === 0) return 'end'
      if (compareToStart > 0 && compareToEnd < 0) return 'middle'

      return ''
    }

    const getDayType = (day: Date): CalendarDayType => {
      if (
        (minDate && compareDay(day, minDate) < 0) ||
        (maxDate && compareDay(day, maxDate) > 0)
      ) {
        return 'disabled'
      }

      if (currentDate == null) return ''

      if (Array.isArray(currentDate)) {
        if (type === 'multiple') return getMultipleDayType(day)
        if (type === 'range') return getRangeDayType(day)
      } else if (type === 'single') {
        return compareDay(day, currentDate) === 0 ? 'selected' : ''
      }

      return ''
    }

    const getBottomInfo = (dayType: CalendarDayType): string | undefined => {
      if (type === 'range') {
        if (dayType === 'start' || dayType === 'end') {
          return CALENDAR_TEXTS[dayType]
        }
        if (dayType === 'start-end') {
          return `${CALENDAR_TEXTS.start}/${CALENDAR_TEXTS.end}`
        }
      }
      return undefined
    }

    const result: CalendarDayItem[] = []
    const year = date.getFullYear()
    const month = date.getMonth()

    for (let day = 1; day <= totalDay; day++) {
      const itemDate = new Date(year, month, day)
      const dayType = getDayType(itemDate)

      let config: CalendarDayItem = {
        date: itemDate,
        type: dayType,
        text: day,
        bottomInfo: getBottomInfo(dayType),
      }

      if (formatter) {
        config = formatter(config)
      }

      result.push(config)
    }

    return result
  }, [
    date,
    totalDay,
    type,
    currentDate,
    minDate,
    maxDate,
    allowSameDay,
    formatter,
  ])

  const disabledDays = useMemo(
    () => days.filter((day) => day.type === 'disabled'),
    [days],
  )

  useEffect(() => {
    onDisabledDaysChange?.(disabledDays)
  }, [disabledDays, onDisabledDaysChange])

  const renderMonthHeader = () => {
    if (!showMonthTitle) return null
    return (
      <view className="lynx-calendar__month-title" style={styles.monthTitle}>
        {renderMonthTitle
          ? renderMonthTitle({ date, text: title })
          : <text>{title}</text>}
      </view>
    )
  }

  const renderMark = () => {
    if (!showMark || !shouldRender) return null
    return (
      <view className="lynx-calendar__month-mark" style={styles.monthMark}>
        <text>{date.getMonth() + 1}</text>
      </view>
    )
  }

  const renderDay = (item: CalendarDayItem, index: number) => (
    <CalendarDay
      key={item.type === 'placeholder' ? `placeholder-${index}` : `${item.date?.getTime() ?? index}`}
      item={item}
      index={index}
      color={color}
      offset={offset}
      rowHeight={rowHeight}
      onClick={onClick}
      onClickDisabledDate={onClickDisabledDate}
      renderTopInfo={renderTopInfo}
      renderBottomInfo={renderBottomInfo}
      renderDayText={renderDayText}
    />
  )

  const containerHeight = useMemo(() => {
    if (!shouldRender) {
      return placeholders.length * parseSize(rowHeight)
    }
    return undefined
  }, [shouldRender, placeholders.length, rowHeight])

  return (
    <view className="lynx-calendar__month" style={containerHeight ? { height: containerHeight } : undefined}>
      {renderMonthHeader()}
      <view className="lynx-calendar__days" style={styles.days}>
        {renderMark()}
        {(shouldRender ? days : placeholders).map(renderDay)}
      </view>
    </view>
  )
}

const styles: Record<string, CSSProperties> = {
  days: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'relative',
  },
  monthTitle: {
    height: CALENDAR_DEFAULTS.monthTitleHeight,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: CALENDAR_DEFAULTS.monthTitleFontSize,
    color: CALENDAR_DEFAULTS.textColor,
    fontWeight: '500',
  },
  monthMark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: CALENDAR_DEFAULTS.monthMarkFontSize,
    color: CALENDAR_DEFAULTS.monthMarkColor,
    zIndex: -1,
    pointerEvents: 'none',
  },
}
