import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Stepper } from './Stepper'

function dispatchInputEvent(element: Element, value: string): void {
  const event = new Event('bindEvent:input', { bubbles: true })
  Object.defineProperty(event, 'detail', {
    value: { value },
    writable: false,
  })
  element.dispatchEvent(event)
}

describe('Stepper', () => {
  it('renders with default value', () => {
    const { container } = render(<Stepper />)
    const input = container.querySelector('.lu-stepper__input')
    expect(input).toHaveAttribute('value', '1')
  })

  it('increments value when plus button is tapped', () => {
    const onChange = vi.fn()
    const { container } = render(<Stepper onChange={onChange} />)
    const plus = container.querySelector('.lu-stepper__plus')
    fireEvent.tap(plus!)
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('decrements value when minus button is tapped', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Stepper defaultValue={5} onChange={onChange} />,
    )
    const minus = container.querySelector('.lu-stepper__minus')
    fireEvent.tap(minus!)
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('clamps to max and triggers onOverlimit', () => {
    const onOverlimit = vi.fn()
    const onChange = vi.fn()
    const { container } = render(
      <Stepper
        defaultValue={3}
        max={3}
        onOverlimit={onOverlimit}
        onChange={onChange}
      />,
    )
    const plus = container.querySelector('.lu-stepper__plus')
    fireEvent.tap(plus!)
    expect(onChange).not.toHaveBeenCalled()
    expect(onOverlimit).toHaveBeenCalledWith('plus', 3)
  })

  it('clamps to min and triggers onOverlimit', () => {
    const onOverlimit = vi.fn()
    const onChange = vi.fn()
    const { container } = render(
      <Stepper
        defaultValue={1}
        min={1}
        onOverlimit={onOverlimit}
        onChange={onChange}
      />,
    )
    const minus = container.querySelector('.lu-stepper__minus')
    fireEvent.tap(minus!)
    expect(onChange).not.toHaveBeenCalled()
    expect(onOverlimit).toHaveBeenCalledWith('minus', 1)
  })

  it('does not respond to taps when disabled', () => {
    const onChange = vi.fn()
    const { container } = render(<Stepper disabled onChange={onChange} />)
    const plus = container.querySelector('.lu-stepper__plus')
    const minus = container.querySelector('.lu-stepper__minus')
    fireEvent.tap(plus!)
    fireEvent.tap(minus!)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('updates value on input changes', () => {
    const onChange = vi.fn()
    const { container } = render(<Stepper onChange={onChange} />)
    const input = container.querySelector('.lu-stepper__input') as Element
    dispatchInputEvent(input, '5')
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('does not update value on input changes when disableInput is true', () => {
    const onChange = vi.fn()
    const { container } = render(<Stepper disableInput onChange={onChange} />)
    const input = container.querySelector('.lu-stepper__input') as Element
    dispatchInputEvent(input, '5')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('formats value according to decimalLength', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Stepper
        defaultValue={1}
        step={0.15}
        decimalLength={1}
        onChange={onChange}
      />,
    )
    const plus = container.querySelector('.lu-stepper__plus')
    fireEvent.tap(plus!)
    expect(onChange).toHaveBeenCalledWith(1.2)
  })

  it('rounds to integer when integer is true', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Stepper
        defaultValue={1}
        step={0.8}
        integer
        onChange={onChange}
      />,
    )
    const plus = container.querySelector('.lu-stepper__plus')
    fireEvent.tap(plus!)
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('allows empty value when allowEmpty is true', () => {
    const onChange = vi.fn()
    const { container } = render(<Stepper allowEmpty onChange={onChange} />)
    const input = container.querySelector('.lu-stepper__input') as Element
    dispatchInputEvent(input, '')
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('applies round theme modifier', () => {
    const { container } = render(<Stepper theme="round" />)
    expect(container.firstChild).toHaveClass('lu-stepper--round')
  })
})
