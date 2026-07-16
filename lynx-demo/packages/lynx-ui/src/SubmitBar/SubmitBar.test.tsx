import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { SubmitBar } from './SubmitBar'

describe('SubmitBar', () => {
  it('renders formatted price with integer and decimal parts', () => {
    const { container } = render(
      <SubmitBar price={12345} label="Total:" suffixLabel="≈" />,
    )

    const priceEl = container.querySelector('.lu-submit-bar__price')
    expect(priceEl).toHaveTextContent('¥')
    expect(priceEl).toHaveTextContent('123')
    expect(priceEl).toHaveTextContent('.45')
    expect(container.querySelector('.lu-submit-bar__suffix-label')).toHaveTextContent('≈')
  })

  it('renders tip text and tip icon', () => {
    const { container, getByText } = render(
      <SubmitBar tip="Please check your order" />,
    )

    expect(getByText('Please check your order')).toBeInTheDocument()
    expect(container.querySelector('.lu-submit-bar__tip-icon')).toBeInTheDocument()
  })

  it('renders the submit button with default text', () => {
    const { getByText } = render(<SubmitBar price={100} />)
    expect(getByText('提交订单')).toBeInTheDocument()
  })

  it('disables the button and prevents submit when disabled', () => {
    const onSubmit = vi.fn()
    const { container } = render(
      <SubmitBar price={100} disabled onSubmit={onSubmit} />,
    )

    const button = container.querySelector('.lu-submit-bar__button')
    expect(button).toHaveClass('lu-btn--disabled')
    fireEvent.tap(button!)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows loading state and prevents submit', () => {
    const onSubmit = vi.fn()
    const { container } = render(
      <SubmitBar price={100} loading onSubmit={onSubmit} />,
    )

    const button = container.querySelector('.lu-submit-bar__button')
    expect(button).toHaveClass('lu-btn--loading')
    fireEvent.tap(button!)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit when the button is tapped', () => {
    const onSubmit = vi.fn()
    const { container } = render(
      <SubmitBar price={100} onSubmit={onSubmit} />,
    )

    const button = container.querySelector('.lu-submit-bar__button')
    fireEvent.tap(button!)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('renders a placeholder view when placeholder is true', () => {
    const { container } = render(
      <SubmitBar price={100} placeholder />,
    )

    expect(container.querySelector('.lu-submit-bar__placeholder')).toBeInTheDocument()
    expect(container.querySelectorAll('.lu-submit-bar').length).toBe(1)
  })
})
