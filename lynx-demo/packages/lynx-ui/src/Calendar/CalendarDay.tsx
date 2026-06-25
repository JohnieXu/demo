import type { CSSProperties } from '@lynx-js/types'
import { CALENDAR_DEFAULTS } from './constants'
import type { CalendarDayProps, CalendarDayType } from './types'
import { isLastRowInMonth, joinClass, parseSize } from './utils'

function getDayStyle(
  type: CalendarDayType,
  color: string,
  rowHeight: number | string,
  offset: number,
  isFirstDay: boolean,
  date?: Date,
): CSSProperties {
  const height = parseSize(rowHeight)
  const base: CSSProperties = {
    width: '14.285%',
    height,
    marginBottom: CALENDAR_DEFAULTS.dayMarginBottom,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  }

  if (type === 'placeholder') {
    return { width: '100%', height }
  }

  if (isFirstDay && offset > 0) {
    base.marginLeft = `${(100 * offset) / 7}%`
  }

  const activeColor = color || CALENDAR_DEFAULTS.primaryColor

  switch (type) {
    case 'selected':
    case 'start-end':
    case 'multiple-selected':
      base.color = CALENDAR_DEFAULTS.selectedDayColor
      base.backgroundColor = activeColor
      base.borderRadius = CALENDAR_DEFAULTS.borderRadius
      break
    case 'start':
      base.color = CALENDAR_DEFAULTS.selectedDayColor
      base.backgroundColor = activeColor
      base.borderRadius = `${CALENDAR_DEFAULTS.borderRadius}px 0 0 ${CALENDAR_DEFAULTS.borderRadius}px`
      break
    case 'end':
      base.color = CALENDAR_DEFAULTS.selectedDayColor
      base.backgroundColor = activeColor
      base.borderRadius = `0 ${CALENDAR_DEFAULTS.borderRadius}px ${CALENDAR_DEFAULTS.borderRadius}px 0`
      break
    case 'middle':
    case 'multiple-middle':
      base.color = activeColor
      base.backgroundColor = `${activeColor}${Math.round(
        CALENDAR_DEFAULTS.rangeMiddleBgOpacity * 255,
      )
        .toString(16)
        .padStart(2, '0')}`
      break
    case 'disabled':
      base.color = CALENDAR_DEFAULTS.disabledColor
      break
  }

  if (date && isLastRowInMonth(date, offset)) {
    base.marginBottom = 0
  }

  return base
}

export function CalendarDay(props: CalendarDayProps) {
  const {
    item,
    color,
    index,
    offset,
    rowHeight,
    onClick,
    onClickDisabledDate,
    renderTopInfo,
    renderBottomInfo,
    renderDayText,
  } = props

  const { type, className, date } = item

  const handleTap = () => {
    if (type === 'disabled') {
      onClickDisabledDate?.(item)
    } else if (type !== 'placeholder' && date) {
      onClick?.(item)
    }
  }

  if (type === 'placeholder') {
    return (
      <view
        className="lynx-calendar__day lynx-calendar__day--placeholder"
        style={getDayStyle('placeholder', color ?? '', rowHeight, offset, false)}
      />
    )
  }

  const dayStyle = getDayStyle(
    type ?? '',
    color ?? '',
    rowHeight,
    offset,
    index === 0,
    date,
  )

  const renderContent = () => {
    const topInfoNode = item.topInfo || renderTopInfo ? (
      <text className="lynx-calendar__top-info" style={styles.topInfo}>
        {renderTopInfo ? renderTopInfo(item) : item.topInfo}
      </text>
    ) : null

    const bottomInfoNode = item.bottomInfo || renderBottomInfo ? (
      <text className="lynx-calendar__bottom-info" style={styles.bottomInfo}>
        {renderBottomInfo ? renderBottomInfo(item) : item.bottomInfo}
      </text>
    ) : null

    const textNode = renderDayText ? (
      renderDayText(item)
    ) : (
      <text className="lynx-calendar__day-text" style={styles.dayText}>{item.text}</text>
    )

    if (type === 'selected') {
      return (
        <view
          className="lynx-calendar__selected-day"
          style={{
            width: parseSize(rowHeight),
            height: parseSize(rowHeight),
            borderRadius: parseSize(rowHeight) / 2,
            backgroundColor: color || CALENDAR_DEFAULTS.primaryColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {topInfoNode}
          {textNode}
          {bottomInfoNode}
        </view>
      )
    }

    return (
      <view style={{ alignItems: 'center', justifyContent: 'center' }}>
        {topInfoNode}
        {textNode}
        {bottomInfoNode}
      </view>
    )
  }

  return (
    <view
      className={joinClass('lynx-calendar__day', `lynx-calendar__day--${type}`, className)}
      style={dayStyle}
      bindtap={handleTap}
      data-testid={`day-${item.text}`}
    >
      {renderContent()}
    </view>
  )
}

const styles: Record<string, CSSProperties> = {
  dayText: {
    fontSize: CALENDAR_DEFAULTS.dayFontSize,
    lineHeight: CALENDAR_DEFAULTS.dayFontSize,
  },
  topInfo: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    fontSize: CALENDAR_DEFAULTS.infoFontSize,
    lineHeight: CALENDAR_DEFAULTS.infoLineHeight,
    textAlign: 'center',
    color: 'inherit',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    fontSize: CALENDAR_DEFAULTS.infoFontSize,
    lineHeight: CALENDAR_DEFAULTS.infoLineHeight,
    textAlign: 'center',
    color: 'inherit',
  },
}
