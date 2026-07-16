import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Radio } from './Radio'

describe('Radio', () => {
  it('renders default', () => {
    const { container } = render(<Radio />)
    expect(container.firstChild).not.toHaveClass('lu-radio--checked')
  })

  it('applies checked class', () => {
    const { container } = render(<Radio defaultChecked />)
    expect(container.firstChild).toHaveClass('lu-radio--checked')
  })

  it('triggers onChange on tap', () => {
    const onChange = vi.fn()
    const { container } = render(<Radio name="a" onChange={onChange} />)
    fireEvent.tap(container.firstChild!)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('renders label', () => {
    const { getByText } = render(<Radio>Apple</Radio>)
    expect(getByText('Apple')).toBeInTheDocument()
  })
})
