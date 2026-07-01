import { Fragment } from '@lynx-js/react'
import { CALENDAR_TEXTS } from './constants'
import type { CalendarHeaderProps } from './types'
import {
  compareMonth,
  formatMonthTitle,
  getNextMonth,
  getNextYear,
  getPrevMonth,
  getPrevYear,
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
    switchMode = 'none',
    onClickSubtitle,
    onPanelChange,
    renderTitle,
    renderSubtitle,
    renderPrevMonth,
    renderNextMonth,
    renderPrevYear,
    renderNextYear,
  } = props

  const canSwitch = switchMode !== 'none'
  const showYearAction = switchMode === 'year-month'

  const prevMonthDisabled =
    !!date && !!minDate && compareMonth(getPrevMonth(date), minDate) < 0

  const nextMonthDisabled =
    !!date && !!maxDate && compareMonth(getNextMonth(date), maxDate) > 0

  const prevYearDisabled =
    !!date && !!minDate && compareMonth(getPrevYear(date), minDate) < 0

  const nextYearDisabled =
    !!date && !!maxDate && compareMonth(getNextYear(date), maxDate) > 0

  const handlePrevMonth = () => {
    if (!date || prevMonthDisabled) return
    onPanelChange?.(getPrevMonth(date))
  }

  const handleNextMonth = () => {
    if (!date || nextMonthDisabled) return
    onPanelChange?.(getNextMonth(date))
  }

  const handlePrevYear = () => {
    if (!date || prevYearDisabled) return
    onPanelChange?.(getPrevYear(date))
  }

  const handleNextYear = () => {
    if (!date || nextYearDisabled) return
    onPanelChange?.(getNextYear(date))
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

  // Mirrors Vant CalendarHeader.tsx:130 — the left side renders [year, month]
  // and the right side renders [month, year]. Year actions only exist in
  // 'year-month' mode.
  const renderAction = (isNext: boolean) => {
    const monthDisabled = isNext ? nextMonthDisabled : prevMonthDisabled
    const yearDisabled = isNext ? nextYearDisabled : prevYearDisabled
    const onMonthClick = isNext ? handleNextMonth : handlePrevMonth
    const onYearClick = isNext ? handleNextYear : handlePrevYear
    const renderMonth = isNext ? renderNextMonth : renderPrevMonth
    const renderYear = isNext ? renderNextYear : renderPrevYear

    const monthAction = renderMonth ? (
      renderMonth({ disabled: monthDisabled, onClick: onMonthClick })
    ) : (
      <view
        className={joinClass(
          'lu-calendar__header-action',
          monthDisabled && 'lu-calendar__header-action--disabled',
        )}
        bindtap={monthDisabled ? undefined : onMonthClick}
      >
        <text>{isNext ? '>' : '<'}</text>
      </view>
    )

    if (!showYearAction) {
      return monthAction
    }

    const yearAction = renderYear ? (
      renderYear({ disabled: yearDisabled, onClick: onYearClick })
    ) : (
      <view
        className={joinClass(
          'lu-calendar__header-action',
          yearDisabled && 'lu-calendar__header-action--disabled',
        )}
        bindtap={yearDisabled ? undefined : onYearClick}
      >
        <text>{isNext ? '»' : '«'}</text>
      </view>
    )

    const monthNode = (
      <Fragment key={isNext ? 'next-month' : 'prev-month'}>
        {monthAction}
      </Fragment>
    )
    const yearNode = (
      <Fragment key={isNext ? 'next-year' : 'prev-year'}>{yearAction}</Fragment>
    )

    return isNext ? [monthNode, yearNode] : [yearNode, monthNode]
  }

  const renderHeaderSubtitle = () => {
    if (!showSubtitle) return null
    const text = subtitle ?? (date ? formatMonthTitle(date) : '')
    const subtitleText = (
      <view className="lu-calendar__header-subtitle-text">
        {renderSubtitle ? renderSubtitle({ date, text }) : <text>{text}</text>}
      </view>
    )

    return (
      <view
        className={joinClass(
          'lu-calendar__header-subtitle',
          canSwitch && 'lu-calendar__header-subtitle--with-switch',
        )}
        bindtap={onClickSubtitle}
      >
        {canSwitch ? (
          <>
            {renderAction(false)}
            {subtitleText}
            {renderAction(true)}
          </>
        ) : (
          subtitleText
        )}
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
