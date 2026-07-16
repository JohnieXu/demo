import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Card } from './Card'

describe('Card', () => {
  it('renders with BEM class and standard layout', () => {
    const { container } = render(
      <Card
        title="Title"
        desc="Description"
        price={99.9}
        num={2}
        thumb="https://example.com/img.png"
      />,
    )
    expect(container.firstChild).toHaveClass('lu-card')
    expect(container.firstChild).toHaveTextContent('Title')
    expect(container.firstChild).toHaveTextContent('Description')
    expect(container.firstChild).toHaveTextContent('¥99')
  })

  it('fires onClickThumb when thumb is tapped', () => {
    const onClickThumb = vi.fn()
    const { container } = render(
      <Card thumb="https://example.com/img.png" onClickThumb={onClickThumb} />,
    )
    const thumb = container.querySelector('.lu-card__thumb')
    fireEvent.tap(thumb!)
    expect(onClickThumb).toHaveBeenCalled()
  })
})
