import type { CSSProperties } from '@lynx-js/types'
import type { CalendarDayProps, CalendarDayType } from './types'
import { isLastRowInMonth, joinClass, parseSize, toCSSSize } from './utils'

const stateMap: Record<CalendarDayType, string> = {
  '': 'normal',
  selected: 'selected',
  'start-end': 'start-end',
  'multiple-selected': 'selected',
  start: 'start',
  end: 'end',
  middle: 'middle',
  'multiple-middle': 'middle',
  disabled: 'disabled',
  placeholder: 'placeholder',
}

function getDayStyle(
  rowHeight: number | string,
  offset: number,
  index: number,
  date?: Date,
): CSSProperties {
  const height = toCSSSize(rowHeight)
  const style: CSSProperties = {
    height,
  }

  if (index === 0 && offset > 0) {
    style.marginLeft = `${(100 * offset) / 7}%`
  }

  if (date && isLastRowInMonth(date, offset)) {
    style.marginBottom = '0px'
  }

  return style
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
        className="lu-calendar__day lu-calendar__day--placeholder"
        style={{ height: toCSSSize(rowHeight) }}
      />
    )
  }

  const dayStyle = getDayStyle(rowHeight, offset, index, date)
  const dayState = stateMap[type ?? '']
  const isSelected =
    type === 'selected' || type === 'start-end' || type === 'multiple-selected'
  const isRangeStart = type === 'start' || type === 'start-end'
  const isRangeEnd = type === 'end' || type === 'start-end'
  const isRangeMiddle = type === 'middle' || type === 'multiple-middle'
  const isDisabled = type === 'disabled'

  const inlineStyle: CSSProperties = {
    ...dayStyle,
    ...(color ? ({ '--lu-color-primary': color } as CSSProperties) : {}),
  }

  const topInfoNode = item.topInfo || renderTopInfo ? (
    <text className="lu-calendar__top-info">
      {renderTopInfo ? renderTopInfo(item) : item.topInfo}
    </text>
  ) : null

  const bottomInfoNode = item.bottomInfo || renderBottomInfo ? (
    <text className="lu-calendar__bottom-info">
      {renderBottomInfo ? renderBottomInfo(item) : item.bottomInfo}
    </text>
  ) : null

  const renderContent = () => {
    const textNode = renderDayText ? (
      renderDayText(item)
    ) : (
      <text className="lu-calendar__day-text">{item.text}</text>
    )

    if (isSelected) {
      // Keep the selected badge smaller than the day cell so adjacent start/end
      // badges in a range do not squeeze each other and cause the top/bottom
      // info labels to wrap (Lynx day cells are ~14.285% wide, while the default
      // rowHeight is 64px). The badge only contains the main day text; info
      // labels stay as absolutely-positioned children of the outer day cell.
      const badgeSize = Math.min(parseSize(rowHeight), 48)
      const radius = badgeSize / 2
      return (
        <view
          className="lu-calendar__selected-day"
          style={{
            width: `${badgeSize}px`,
            height: `${badgeSize}px`,
            borderRadius: `${radius}px`,
          }}
        >
          {textNode}
        </view>
      )
    }

    return (
      <view className="lu-calendar__day-content">
        {textNode}
      </view>
    )
  }

  return (
    <view
      className={joinClass(
        'lu-calendar__day',
        `lu-calendar__day--${dayState}`,
        isSelected && 'lu-calendar__day--selected',
        isRangeStart && 'lu-calendar__day--range-start',
        isRangeEnd && 'lu-calendar__day--range-end',
        isRangeMiddle && 'lu-calendar__day--range-middle',
        isDisabled && 'lu-calendar__day--disabled',
        className,
      )}
      style={inlineStyle}
      bindtap={handleTap}
      data-testid={`day-${item.text}`}
    >
      {topInfoNode}
      {renderContent()}
      {bottomInfoNode}
    </view>
  )
}
