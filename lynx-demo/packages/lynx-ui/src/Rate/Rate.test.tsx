import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Rate } from './Rate'

describe('Rate', () => {
  it('renders the correct number of stars', () => {
    const { container } = render(<Rate count={7} />)
    expect(container.querySelectorAll('.lu-rate__item')).toHaveLength(7)
  })

  it('calls onChange when a star is tapped', () => {
    const onChange = vi.fn()
    const { container } = render(<Rate onChange={onChange} />)
    const stars = container.querySelectorAll('.lu-rate__touch')
    fireEvent.tap(stars[2])
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('does not call onChange when readonly', () => {
    const onChange = vi.fn()
    const { container } = render(<Rate readonly onChange={onChange} />)
    expect(container.querySelectorAll('.lu-rate__touch')).toHaveLength(0)
    fireEvent.tap(container.firstChild!)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn()
    const { container } = render(<Rate disabled onChange={onChange} />)
    expect(container.querySelectorAll('.lu-rate__touch')).toHaveLength(0)
    fireEvent.tap(container.firstChild!)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('supports half-star selection', () => {
    const onChange = vi.fn()
    const { container } = render(<Rate allowHalf onChange={onChange} />)
    const leftHalves = container.querySelectorAll('.lu-rate__half--left')
    const rightHalves = container.querySelectorAll('.lu-rate__half--right')

    fireEvent.tap(leftHalves[2])
    expect(onChange).toHaveBeenCalledWith(2.5)

    onChange.mockClear()
    fireEvent.tap(rightHalves[3])
    expect(onChange).toHaveBeenCalledWith(4)
  })
})
