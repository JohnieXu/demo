import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Switch } from './Switch'

describe('Switch', () => {
  it('renders with defaultChecked', () => {
    const { container } = render(<Switch defaultChecked />)
    expect(container.firstChild).toHaveClass('lu-switch--on')
  })

  it('applies disabled class', () => {
    const { container } = render(<Switch disabled />)
    expect(container.firstChild).toHaveClass('lu-switch--disabled')
  })

  it('toggles when tapped', () => {
    const onChange = vi.fn()
    const { container } = render(<Switch onChange={onChange} />)
    fireEvent.tap(container.firstChild!)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('does not toggle when disabled', () => {
    const onChange = vi.fn()
    const { container } = render(<Switch disabled onChange={onChange} />)
    fireEvent.tap(container.firstChild!)
    expect(onChange).not.toHaveBeenCalled()
  })
})
