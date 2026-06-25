import type { CSSProperties } from '@lynx-js/types'
import { CALENDAR_DEFAULTS, CALENDAR_TEXTS } from './constants'
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
      <view className="lynx-calendar__header-title" style={styles.headerTitle}>
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
          'lynx-calendar__header-action',
          disabled && 'lynx-calendar__header-action--disabled',
        )}
        style={headerActionStyle(disabled)}
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
        className="lynx-calendar__header-subtitle"
        style={styles.headerSubtitle}
        bindtap={onClickSubtitle}
      >
        {renderAction(false)}
        <view className="lynx-calendar__header-subtitle-text" style={styles.subtitleText}>
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
      <view className="lynx-calendar__weekdays" style={styles.weekdays}>
        {weekdays.map((text, index) => (
          <view key={index} className="lynx-calendar__weekday" style={styles.weekday}>
            <text>{text}</text>
          </view>
        ))}
      </view>
    )
  }

  return (
    <view className="lynx-calendar__header" style={styles.header}>
      {renderHeaderTitle()}
      {renderHeaderSubtitle()}
      {renderWeekdays()}
    </view>
  )
}

const headerActionStyle = (disabled: boolean): CSSProperties => ({
  width: CALENDAR_DEFAULTS.headerActionSize + 16,
  height: CALENDAR_DEFAULTS.headerActionSize + 16,
  alignItems: 'center',
  justifyContent: 'center',
  color: disabled ? CALENDAR_DEFAULTS.headerActionDisabledColor : CALENDAR_DEFAULTS.headerActionColor,
  fontSize: CALENDAR_DEFAULTS.headerActionSize,
  fontWeight: '600',
})

const styles: Record<string, CSSProperties> = {
  header: {
    flexShrink: 0,
    backgroundColor: CALENDAR_DEFAULTS.background,
    boxShadow: '0 2px 8px rgba(100, 101, 102, 0.08)',
    zIndex: 1,
  },
  headerTitle: {
    height: CALENDAR_DEFAULTS.headerTitleHeight,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: CALENDAR_DEFAULTS.headerTitleFontSize,
    color: CALENDAR_DEFAULTS.textColor,
    fontWeight: '600',
  },
  headerSubtitle: {
    height: CALENDAR_DEFAULTS.headerSubtitleHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: CALENDAR_DEFAULTS.paddingMd,
    paddingRight: CALENDAR_DEFAULTS.paddingMd,
  },
  subtitleText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: CALENDAR_DEFAULTS.headerSubtitleFontSize,
    color: CALENDAR_DEFAULTS.textColor,
    fontWeight: '600',
  },
  weekdays: {
    height: CALENDAR_DEFAULTS.weekdayHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekday: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: CALENDAR_DEFAULTS.weekdayFontSize,
    color: CALENDAR_DEFAULTS.weekdayColor,
  },
}
