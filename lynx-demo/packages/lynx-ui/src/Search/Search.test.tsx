import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Search } from './Search'

function asElement(value: unknown): Element {
  return value as Element
}

function dispatchInputEvent(element: Element, value: string): void {
  const event = new Event('bindEvent:input', { bubbles: true })
  Object.defineProperty(event, 'detail', {
    value: { value },
    writable: false,
  })
  element.dispatchEvent(event)
}

function dispatchConfirmEvent(element: Element, value: string): void {
  const event = new Event('bindEvent:confirm', { bubbles: true })
  Object.defineProperty(event, 'detail', {
    value: { value },
    writable: false,
  })
  element.dispatchEvent(event)
}

describe('Search', () => {
  it('renders input with placeholder', () => {
    const { container } = render(<Search placeholder="Search..." />)
    const input = container.querySelector('.lu-search__input')
    expect(input).toBeInTheDocument()
    expect(asElement(input)).toHaveAttribute('placeholder', 'Search...')
  })

  it('triggers onChange when input changes', () => {
    const onChange = vi.fn()
    const { container } = render(<Search onChange={onChange} />)
    const input = asElement(container.querySelector('.lu-search__input'))
    dispatchInputEvent(input, 'hello')
    expect(onChange).toHaveBeenCalledWith('hello')
  })

  it('triggers onSearch on confirm', () => {
    const onSearch = vi.fn()
    const { container } = render(
      <Search defaultValue="query" onSearch={onSearch} />,
    )
    const input = asElement(container.querySelector('.lu-search__input'))
    dispatchConfirmEvent(input, 'query')
    expect(onSearch).toHaveBeenCalledWith('query')
  })

  it('clears value and calls onClear when clear icon is tapped', () => {
    const onChange = vi.fn()
    const onClear = vi.fn()
    const { container } = render(
      <Search defaultValue="abc" onChange={onChange} onClear={onClear} />,
    )
    const clear = container.querySelector('.lu-search__clear')
    expect(clear).toBeInTheDocument()
    fireEvent.tap(clear!)
    expect(onChange).toHaveBeenCalledWith('')
    expect(onClear).toHaveBeenCalled()
  })

  it('does not show clear icon when value is empty', () => {
    const { container } = render(<Search />)
    expect(container.querySelector('.lu-search__clear')).not.toBeInTheDocument()
  })

  it('does not show clear icon when disabled or readonly', () => {
    const { container: disabledContainer } = render(
      <Search defaultValue="x" disabled />,
    )
    expect(disabledContainer.querySelector('.lu-search__clear')).not.toBeInTheDocument()

    const { container: readonlyContainer } = render(
      <Search defaultValue="x" readonly />,
    )
    expect(readonlyContainer.querySelector('.lu-search__clear')).not.toBeInTheDocument()
  })

  it('renders action button when showAction is true', () => {
    const onCancel = vi.fn()
    const { container } = render(
      <Search showAction onCancel={onCancel} />,
    )
    const action = container.querySelector('.lu-search__action')
    expect(action).toBeInTheDocument()
    expect(container.querySelector('.lu-search__action-text')).toHaveTextContent('取消')
    fireEvent.tap(action!)
    expect(onCancel).toHaveBeenCalled()
  })

  it('renders custom action text', () => {
    const { getByText } = render(<Search showAction actionText="Search" />)
    expect(getByText('Search')).toBeInTheDocument()
  })

  it('applies round shape class', () => {
    const { container } = render(<Search shape="round" />)
    expect(container.firstChild).toHaveClass('lu-search--round')
  })

  it('applies input align classes', () => {
    const { container } = render(<Search inputAlign="center" />)
    const input = container.querySelector('.lu-search__input')
    expect(input).toHaveClass('lu-search__input--center')
  })

  it('renders custom left and right icons', () => {
    const { getByText } = render(
      <Search leftIcon={<text>L</text>} rightIcon={<text>R</text>} />,
    )
    expect(getByText('L')).toBeInTheDocument()
    expect(getByText('R')).toBeInTheDocument()
  })

  it('calls onClickInput when input is tapped', () => {
    const onClickInput = vi.fn()
    const { container } = render(<Search onClickInput={onClickInput} />)
    const wrap = asElement(container.querySelector('.lu-search__input-wrap'))
    fireEvent.tap(wrap)
    expect(onClickInput).toHaveBeenCalled()
  })

  it('supports controlled value', () => {
    const onChange = vi.fn()
    const { container, rerender } = render(
      <Search value="initial" onChange={onChange} />,
    )
    const input = asElement(container.querySelector('.lu-search__input'))
    expect(input).toHaveAttribute('value', 'initial')

    rerender(<Search value="updated" onChange={onChange} />)
    expect(asElement(container.querySelector('.lu-search__input'))).toHaveAttribute('value', 'updated')
  })
})
