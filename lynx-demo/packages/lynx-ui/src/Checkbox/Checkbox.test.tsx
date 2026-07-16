import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders round by default', () => {
    const { container } = render(<Checkbox />)
    expect(container.firstChild).toHaveClass('lu-checkbox--round')
  })

  it('applies round class', () => {
    const { container } = render(<Checkbox shape="round" />)
    expect(container.firstChild).toHaveClass('lu-checkbox--round')
  })

  it('renders checked class', () => {
    const { container } = render(<Checkbox defaultChecked />)
    expect(container.firstChild).toHaveClass('lu-checkbox--checked')
  })

  it('toggles on tap', () => {
    const onChange = vi.fn()
    const { container } = render(<Checkbox onChange={onChange} />)
    fireEvent.tap(container.firstChild!)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('does not toggle when disabled', () => {
    const onChange = vi.fn()
    const { container } = render(<Checkbox disabled onChange={onChange} />)
    fireEvent.tap(container.firstChild!)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders label', () => {
    const { getByText } = render(<Checkbox>Agree</Checkbox>)
    expect(getByText('Agree')).toBeInTheDocument()
  })
})
