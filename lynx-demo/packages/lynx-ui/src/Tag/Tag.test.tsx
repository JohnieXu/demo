import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Tag } from './Tag'

describe('Tag', () => {
  it('renders type variant classes', () => {
    const { container } = render(<Tag type="danger">Danger</Tag>)
    expect(container.firstChild).toHaveClass('lu-tag--danger')
  })

  it('renders size class', () => {
    const { container } = render(<Tag size="large">Large</Tag>)
    expect(container.firstChild).toHaveClass('lu-tag--large')
  })

  it('renders plain and round classes', () => {
    const { container } = render(
      <Tag plain round>Text</Tag>,
    )
    expect(container.firstChild).toHaveClass('lu-tag--plain')
    expect(container.firstChild).toHaveClass('lu-tag--round')
  })

  it('calls onClose when close icon is tapped', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Tag closeable onClose={onClose}>X</Tag>,
    )
    const close = container.querySelector('.lu-tag__close')
    expect(close).toBeInTheDocument()
    fireEvent.tap(close!)
    expect(onClose).toHaveBeenCalled()
  })

  it('returns null when show is false', () => {
    const { container } = render(<Tag show={false}>Hidden</Tag>)
    expect(container.firstChild).toBeNull()
  })
})
