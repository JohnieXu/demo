import { CALENDAR_TEXTS } from './constants'
import type { CalendarHeaderProps } from './types'
import {
  compareMonth,
  formatMonthTitle,
  getNextMonth,
  getPrevMonth,
  joinClass,
} from './utils'

export function CalendarHeader(props: CalendarHeaderProps) {
  const {
    date,
    minDate,
    maxDate,
    title,
    subtitle,
    showTitle = true,
    showSubtitle = true,
    firstDayOfWeek = 0,
    onClickSubtitle,
    onPanelChange,
    renderTitle,
    renderSubtitle,
    renderPrevMonth,
    renderNextMonth,
  } = props

  const prevMonthDisabled =
    !!date &&
    !!minDate &&
    compareMonth(getPrevMonth(date), minDate) < 0

  const nextMonthDisabled =
    !!date &&
    !!maxDate &&
    compareMonth(getNextMonth(date), maxDate) > 0

  const handlePrevMonth = () => {
    if (!date || prevMonthDisabled) return
    onPanelChange?.(getPrevMonth(date))
  }

  const handleNextMonth = () => {
    if (!date || nextMonthDisabled) return
    onPanelChange?.(getNextMonth(date))
  }

  const renderHeaderTitle = () => {
    if (!showTitle) return null
    const text = title ?? CALENDAR_TEXTS.title
    return (
      <view className="lu-calendar__header-title">
        {renderTitle ? renderTitle() : <text>{text}</text>}
      </view>
    )
  }

  const renderAction = (isNext: boolean) => {
    const disabled = isNext ? nextMonthDisabled : prevMonthDisabled
    const onClick = isNext ? handleNextMonth : handlePrevMonth

    if (isNext && renderNextMonth) {
      return renderNextMonth({ disabled, onClick })
    }
    if (!isNext && renderPrevMonth) {
      return renderPrevMonth({ disabled, onClick })
    }

    return (
      <view
        className={joinClass(
          'lu-calendar__header-action',
          disabled && 'lu-calendar__header-action--disabled',
        )}
        bindtap={disabled ? undefined : onClick}
      >
        <text>{isNext ? '>' : '<'}</text>
      </view>
    )
  }

  const renderHeaderSubtitle = () => {
    if (!showSubtitle) return null
    const text = subtitle ?? (date ? formatMonthTitle(date) : '')
    return (
      <view
        className="lu-calendar__header-subtitle"
        bindtap={onClickSubtitle}
      >
        {renderAction(false)}
        <view className="lu-calendar__header-subtitle-text">
          {renderSubtitle ? renderSubtitle({ date, text }) : <text>{text}</text>}
        </view>
        {renderAction(true)}
      </view>
    )
  }

  const renderWeekdays = () => {
    const weekdays = [
      ...CALENDAR_TEXTS.weekdays.slice(firstDayOfWeek, 7),
      ...CALENDAR_TEXTS.weekdays.slice(0, firstDayOfWeek),
    ]

    return (
      <view className="lu-calendar__weekdays">
        {weekdays.map((text, index) => (
          <view key={index} className="lu-calendar__weekday">
            <text>{text}</text>
          </view>
        ))}
      </view>
    )
  }

  return (
    <view className="lu-calendar__header">
      {renderHeaderTitle()}
      {renderHeaderSubtitle()}
      {renderWeekdays()}
    </view>
  )
}
