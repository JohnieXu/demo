import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Calendar } from './Calendar'

function createDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day)
}

function asElement(value: unknown): Element {
  return value as Element
}

function asElements(value: unknown): Element[] {
  return value as Element[]
}

describe('Calendar', () => {
  it('renders current month title and weekday headers', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)

    const { getByText, getAllByText } = render(
      <Calendar poppable={false} minDate={minDate} maxDate={maxDate} />,
    )

    expect(asElements(getAllByText('2026年6月')).length).toBeGreaterThanOrEqual(1)
    expect(asElement(getByText('日'))).toBeInTheDocument()
    expect(asElement(getByText('一'))).toBeInTheDocument()
  })

  it('selects a day in single mode', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)
    const onSelect = vi.fn()

    const { getByTestId } = render(
      <Calendar
        poppable={false}
        type="single"
        minDate={minDate}
        maxDate={maxDate}
        onSelect={onSelect}
      />,
    )

    fireEvent.tap(asElement(getByTestId('day-15')))
    expect(onSelect).toHaveBeenCalledTimes(1)
    const selected = onSelect.mock.calls[0][0]
    expect(selected.getDate()).toBe(15)
  })

  it('auto-confirms in single mode when showConfirm is false', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)
    const onConfirm = vi.fn()

    const { getByTestId } = render(
      <Calendar
        poppable={false}
        type="single"
        minDate={minDate}
        maxDate={maxDate}
        showConfirm={false}
        onConfirm={onConfirm}
      />,
    )

    fireEvent.tap(asElement(getByTestId('day-15')))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('selects a range of days', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)
    const onSelect = vi.fn()

    const { getByTestId } = render(
      <Calendar
        poppable={false}
        type="range"
        minDate={minDate}
        maxDate={maxDate}
        onSelect={onSelect}
      />,
    )

    fireEvent.tap(asElement(getByTestId('day-10')))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0][0]).toHaveLength(1)

    fireEvent.tap(asElement(getByTestId('day-15')))
    expect(onSelect).toHaveBeenCalledTimes(2)
    const selected = onSelect.mock.calls[1][0]
    expect(selected).toHaveLength(2)
    expect(selected[0].getDate()).toBe(10)
    expect(selected[1].getDate()).toBe(15)
  })

  it('allows same day range when allowSameDay is true', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)
    const onSelect = vi.fn()

    const { getByTestId } = render(
      <Calendar
        poppable={false}
        type="range"
        minDate={minDate}
        maxDate={maxDate}
        allowSameDay
        onSelect={onSelect}
      />,
    )

    fireEvent.tap(asElement(getByTestId('day-10')))
    fireEvent.tap(asElement(getByTestId('day-10')))

    const selected = onSelect.mock.calls[onSelect.mock.calls.length - 1][0]
    expect(selected).toHaveLength(2)
    expect(selected[0].getDate()).toBe(10)
    expect(selected[1].getDate()).toBe(10)
  })

  it('toggles days in multiple mode', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)
    const onSelect = vi.fn()
    const onUnselect = vi.fn()

    const { getByTestId } = render(
      <Calendar
        poppable={false}
        type="multiple"
        minDate={minDate}
        maxDate={maxDate}
        onSelect={onSelect}
        onUnselect={onUnselect}
      />,
    )

    fireEvent.tap(asElement(getByTestId('day-10')))
    expect(onSelect).toHaveBeenCalled()

    fireEvent.tap(asElement(getByTestId('day-15')))
    expect(onSelect).toHaveBeenCalledTimes(2)

    fireEvent.tap(asElement(getByTestId('day-10')))
    expect(onUnselect).toHaveBeenCalledTimes(1)
  })

  it('disables days outside minDate and maxDate', () => {
    const minDate = createDate(2026, 6, 10)
    const maxDate = createDate(2026, 6, 20)
    const onSelect = vi.fn()
    const onClickDisabledDate = vi.fn()

    const { getByTestId } = render(
      <Calendar
        poppable={false}
        type="single"
        minDate={minDate}
        maxDate={maxDate}
        onSelect={onSelect}
        onClickDisabledDate={onClickDisabledDate}
      />,
    )

    fireEvent.tap(asElement(getByTestId('day-5')))
    expect(onSelect).not.toHaveBeenCalled()
    expect(onClickDisabledDate).toHaveBeenCalledTimes(1)

    fireEvent.tap(asElement(getByTestId('day-15')))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('limits range with maxRange and emits onOverRange', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)
    const onOverRange = vi.fn()

    const { getByTestId } = render(
      <Calendar
        poppable={false}
        type="range"
        minDate={minDate}
        maxDate={maxDate}
        maxRange={3}
        showRangePrompt
        onOverRange={onOverRange}
      />,
    )

    fireEvent.tap(asElement(getByTestId('day-10')))
    fireEvent.tap(asElement(getByTestId('day-15')))
    expect(onOverRange).toHaveBeenCalled()
  })

  it('prevents selection in readonly mode', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)
    const onSelect = vi.fn()

    const { getByTestId } = render(
      <Calendar
        poppable={false}
        type="single"
        minDate={minDate}
        maxDate={maxDate}
        readonly
        onSelect={onSelect}
      />,
    )

    fireEvent.tap(asElement(getByTestId('day-15')))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('shows popup when poppable and show is true', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)

    const { queryAllByText } = render(
      <Calendar show={false} poppable minDate={minDate} maxDate={maxDate} />,
    )
    expect(asElements(queryAllByText('2026年6月')).length).toBe(0)

    const { queryAllByText: queryAllByText2 } = render(
      <Calendar show poppable minDate={minDate} maxDate={maxDate} />,
    )
    expect(asElements(queryAllByText2('2026年6月')).length).toBeGreaterThanOrEqual(1)
  })

  it('closes popup when overlay is tapped', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)
    const onShowChange = vi.fn()

    const { container } = render(
      <Calendar
        show
        poppable
        minDate={minDate}
        maxDate={maxDate}
        onShowChange={onShowChange}
      />,
    )

    const overlay = container.firstChild
    expect(overlay).toBeInTheDocument()
    fireEvent.tap(overlay!)
    expect(onShowChange).toHaveBeenCalledWith(false)
  })

  it('does not show month-switch arrows in none mode (default)', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)

    const { queryByText } = render(
      <Calendar poppable={false} minDate={minDate} maxDate={maxDate} />,
    )

    expect(queryByText('<')).not.toBeInTheDocument()
    expect(queryByText('>')).not.toBeInTheDocument()
  })

  it('shows month arrows in month switch mode', () => {
    const { getByText } = render(
      <Calendar poppable={false} switchMode="month" />,
    )

    expect(asElement(getByText('<'))).toBeInTheDocument()
    expect(asElement(getByText('>'))).toBeInTheDocument()
    // No year arrows in plain month mode.
    // (queryByText would return null; getByText throwing is covered elsewhere.)
  })

  it('shows year and month arrows in year-month switch mode', () => {
    const { getByText } = render(
      <Calendar poppable={false} switchMode="year-month" />,
    )

    expect(asElement(getByText('«'))).toBeInTheDocument()
    expect(asElement(getByText('<'))).toBeInTheDocument()
    expect(asElement(getByText('>'))).toBeInTheDocument()
    expect(asElement(getByText('»'))).toBeInTheDocument()
  })

  it('emits onPanelChange when switching to the next month', () => {
    const onPanelChange = vi.fn()

    const { getByText } = render(
      <Calendar
        poppable={false}
        switchMode="month"
        onPanelChange={onPanelChange}
      />,
    )

    // The arrow glyph lives in a <text> inside the tappable action <view>.
    fireEvent.tap(asElement(getByText('>')).parentElement!)
    expect(onPanelChange).toHaveBeenCalledTimes(1)
    expect(onPanelChange.mock.calls[0][0].date).toBeInstanceOf(Date)
  })

  it('confirms with the just-selected date when showConfirm is false (L1)', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)
    const onConfirm = vi.fn()

    const { getByTestId } = render(
      <Calendar
        poppable={false}
        type="single"
        minDate={minDate}
        maxDate={maxDate}
        showConfirm={false}
        onConfirm={onConfirm}
      />,
    )

    fireEvent.tap(asElement(getByTestId('day-15')))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    // Regression for L1: previously onConfirm received the stale currentDate.
    expect(onConfirm.mock.calls[0][0].getDate()).toBe(15)
  })

  it('does not confirm when range exceeds maxRange (L3)', () => {
    const minDate = createDate(2026, 6, 1)
    const maxDate = createDate(2026, 6, 30)
    const onOverRange = vi.fn()
    const onConfirm = vi.fn()

    const { getByTestId } = render(
      <Calendar
        poppable={false}
        type="range"
        minDate={minDate}
        maxDate={maxDate}
        maxRange={3}
        showConfirm={false}
        onOverRange={onOverRange}
        onConfirm={onConfirm}
      />,
    )

    fireEvent.tap(asElement(getByTestId('day-10')))
    fireEvent.tap(asElement(getByTestId('day-15')))
    expect(onOverRange).toHaveBeenCalled()
    // Regression for L3: overflow auto-truncates but must NOT confirm.
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
