import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Cell } from './Cell'

describe('Cell', () => {
  it('renders title and value', () => {
    const { getByText } = render(
      <Cell title="Title" value="Value" />,
    )
    expect(getByText('Title')).toBeInTheDocument()
    expect(getByText('Value')).toBeInTheDocument()
  })

  it('renders label', () => {
    const { getByText } = render(
      <Cell title="Title" label="Label" />,
    )
    expect(getByText('Label')).toBeInTheDocument()
  })

  it('calls onClick when clickable', () => {
    const onClick = vi.fn()
    const { container } = render(
      <Cell title="Title" isLink onClick={onClick} />,
    )
    fireEvent.tap(container.firstChild!)
    expect(onClick).toHaveBeenCalled()
  })

  it('does not call onClick when not clickable', () => {
    const onClick = vi.fn()
    const { container } = render(
      <Cell title="Title" onClick={onClick} />,
    )
    fireEvent.tap(container.firstChild!)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders arrow for isLink', () => {
    const { container } = render(<Cell title="Title" isLink />)
    expect(container.querySelector('.lu-cell__arrow')).toBeInTheDocument()
  })

  it('applies size and center classes', () => {
    const { container } = render(<Cell title="Title" size="large" center />)
    expect(container.firstChild).toHaveClass('lu-cell--large')
    expect(container.firstChild).toHaveClass('lu-cell--center')
  })
})
