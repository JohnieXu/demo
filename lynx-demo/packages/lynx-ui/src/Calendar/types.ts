import type { ReactNode, RefObject } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export type CalendarType = 'single' | 'range' | 'multiple'

export type CalendarSwitchMode = 'none' | 'month' | 'year-month'

export type CalendarDayType =
  | ''
  | 'start'
  | 'start-end'
  | 'middle'
  | 'end'
  | 'selected'
  | 'multiple-middle'
  | 'multiple-selected'
  | 'disabled'
  | 'placeholder'

export type CalendarDayItem = {
  date?: Date
  text?: string | number
  type?: CalendarDayType
  topInfo?: string
  bottomInfo?: string
  className?: string
}

export interface CalendarRef {
  reset: (date?: Date | Date[] | null) => void
  scrollToDate: (targetDate: Date) => void
  getSelectedDate: () => Date | Date[] | null
}

export interface CalendarProps {
  /** Whether to show the popup wrapper. Only used when poppable is true. */
  show?: boolean
  /** Selection type. Default: 'single' */
  type?: CalendarType
  /** Panel switch mode: 'none' tiles all months as a scroll list (no arrows);
   *  'month' / 'year-month' show one month with paging arrows. Default: 'none' */
  switchMode?: CalendarSwitchMode
  /** Popup title. */
  title?: ReactNode
  /** Primary accent color. Default: #ff5712 */
  color?: string
  /** Whether the popup content has rounded top corners. Default: true */
  round?: boolean
  /** Whether to render as a popup. Default: true */
  poppable?: boolean
  /** Max selectable days for range/multiple mode. */
  maxRange?: number | string
  /** Whether to show the watermark behind each month. Default: true */
  showMark?: boolean
  /** Whether to show the popup title. Default: true */
  showTitle?: boolean
  /** Custom formatter for day items. */
  formatter?: (item: CalendarDayItem) => CalendarDayItem
  /** Height of each day row. Default: 64 */
  rowHeight?: number | string
  /** Text of the confirm button. Default: '确定' */
  confirmText?: ReactNode
  /** Prompt message when range exceeds maxRange. */
  rangePrompt?: string
  /** Whether to lazy-render months outside the visible area. Default: true */
  lazyRender?: boolean
  /** Whether to show the confirm button. Default: true */
  showConfirm?: boolean
  /** Initial selected date(s). */
  defaultDate?: Date | Date[] | null
  /** Whether the same day can be start and end in range mode. Default: false */
  allowSameDay?: boolean
  /** Whether to show the month subtitle. Default: true */
  showSubtitle?: boolean
  /** Confirm button text when selection is incomplete. */
  confirmDisabledText?: ReactNode
  /** Add bottom safe-area padding. Default: true */
  safeAreaInsetBottom?: boolean
  /** Minimum selectable date. Default: today */
  minDate?: Date
  /** Maximum selectable date. Default: 6 months from today */
  maxDate?: Date
  /** First day of week, 0-6. Default: 0 (Sunday) */
  firstDayOfWeek?: number
  /** Read-only mode. Default: false */
  readonly?: boolean
  /** Show range prompt on overRange. Default: true */
  showRangePrompt?: boolean

  style?: CSSProperties
  className?: string

  /** Render prop for the popup title. */
  renderTitle?: () => ReactNode
  /** Render prop for the month subtitle. */
  renderSubtitle?: (params: { date?: Date; text?: string }) => ReactNode
  /** Render prop for each month title. */
  renderMonthTitle?: (params: { date: Date; text: string }) => ReactNode
  /** Render prop for top info of a day. */
  renderTopInfo?: (item: CalendarDayItem) => ReactNode
  /** Render prop for bottom info of a day. */
  renderBottomInfo?: (item: CalendarDayItem) => ReactNode
  /** Render prop for day text. */
  renderDayText?: (item: CalendarDayItem) => ReactNode
  /** Render prop for footer content. */
  renderFooter?: () => ReactNode
  /** Render prop for confirm button. */
  renderConfirm?: (params: { disabled: boolean; onConfirm: () => void }) => ReactNode
  /** Render prop for previous month arrow. */
  renderPrevMonth?: (params: { disabled: boolean; onClick: () => void }) => ReactNode
  /** Render prop for next month arrow. */
  renderNextMonth?: (params: { disabled: boolean; onClick: () => void }) => ReactNode
  /** Render prop for previous year arrow. Only used in year-month mode. */
  renderPrevYear?: (params: { disabled: boolean; onClick: () => void }) => ReactNode
  /** Render prop for next year arrow. Only used in year-month mode. */
  renderNextYear?: (params: { disabled: boolean; onClick: () => void }) => ReactNode

  onSelect?: (date: Date | Date[]) => void
  onConfirm?: (date: Date | Date[]) => void
  onUnselect?: (date: Date) => void
  onMonthShow?: (params: { date: Date; title: string }) => void
  /** Fired when the panel month changes in month/year-month mode. */
  onPanelChange?: (params: { date: Date }) => void
  onOverRange?: () => void
  onShowChange?: (show: boolean) => void
  onClickDisabledDate?: (item: CalendarDayItem) => void
  onClickOverlay?: () => void
}

export interface CalendarDayProps {
  item: CalendarDayItem
  color?: string
  index: number
  offset: number
  rowHeight: number | string
  onClick?: (item: CalendarDayItem) => void
  onClickDisabledDate?: (item: CalendarDayItem) => void
  renderTopInfo?: (item: CalendarDayItem) => ReactNode
  renderBottomInfo?: (item: CalendarDayItem) => ReactNode
  renderDayText?: (item: CalendarDayItem) => ReactNode
}

export interface CalendarMonthProps {
  date: Date
  type?: CalendarType
  color?: string
  minDate?: Date
  maxDate?: Date
  showMark?: boolean
  rowHeight?: number | string
  formatter?: (item: CalendarDayItem) => CalendarDayItem
  lazyRender?: boolean
  visible?: boolean
  currentDate?: Date | Date[] | null
  allowSameDay?: boolean
  showSubtitle?: boolean
  showMonthTitle?: boolean
  firstDayOfWeek?: number
  onClick?: (item: CalendarDayItem) => void
  onClickDisabledDate?: (item: CalendarDayItem) => void
  onDisabledDaysChange?: (days: CalendarDayItem[]) => void
  renderMonthTitle?: (params: { date: Date; text: string }) => ReactNode
  renderTopInfo?: (item: CalendarDayItem) => ReactNode
  renderBottomInfo?: (item: CalendarDayItem) => ReactNode
  renderDayText?: (item: CalendarDayItem) => ReactNode
}

export interface CalendarHeaderProps {
  date?: Date
  minDate?: Date
  maxDate?: Date
  title?: ReactNode
  subtitle?: string
  showTitle?: boolean
  showSubtitle?: boolean
  firstDayOfWeek?: number
  switchMode?: CalendarSwitchMode
  onClickSubtitle?: () => void
  onPanelChange?: (date: Date) => void
  renderTitle?: () => ReactNode
  renderSubtitle?: (params: { date?: Date; text?: string }) => ReactNode
  renderPrevMonth?: (params: { disabled: boolean; onClick: () => void }) => ReactNode
  renderNextMonth?: (params: { disabled: boolean; onClick: () => void }) => ReactNode
  renderPrevYear?: (params: { disabled: boolean; onClick: () => void }) => ReactNode
  renderNextYear?: (params: { disabled: boolean; onClick: () => void }) => ReactNode
}

export interface CalendarScrollViewRef {
  current: RefObject<{
    setNativeProps?: (props: Record<string, unknown>) => void
  }>
}
