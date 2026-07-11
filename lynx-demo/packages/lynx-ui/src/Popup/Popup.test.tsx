import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Popup } from './Popup'

function asElement(value: unknown): Element {
  return value as Element
}

function asElements(value: unknown): Element[] {
  return value as Element[]
}

describe('Popup', () => {
  it('renders when show is true and hides when show is false', () => {
    const { queryAllByText, rerender } = render(
      <Popup show={false}>Hidden</Popup>,
    )
    expect(asElements(queryAllByText('Hidden')).length).toBe(0)

    rerender(<Popup show>Visible</Popup>)
    expect(asElements(queryAllByText('Visible')).length).toBeGreaterThanOrEqual(1)
  })

  it('closes popup when overlay is tapped', () => {
    const onShowChange = vi.fn()
    const { container } = render(
      <Popup show onShowChange={onShowChange}>
        Content
      </Popup>,
    )

    const overlay = container.querySelector('.lu-popup__overlay')
    expect(overlay).toBeInTheDocument()
    fireEvent.tap(overlay!)
    expect(onShowChange).toHaveBeenCalledWith(false)
  })

  it('does not close popup when overlay tap is disabled', () => {
    const onShowChange = vi.fn()
    const onClickOverlay = vi.fn()
    const { container } = render(
      <Popup show closeOnClickOverlay={false} onShowChange={onShowChange} onClickOverlay={onClickOverlay}>
        Content
      </Popup>,
    )

    const overlay = container.querySelector('.lu-popup__overlay')
    fireEvent.tap(overlay!)
    expect(onClickOverlay).toHaveBeenCalledTimes(1)
    expect(onShowChange).not.toHaveBeenCalled()
  })

  it('does not close popup when content is tapped', () => {
    const onShowChange = vi.fn()
    const { getByText } = render(
      <Popup show onShowChange={onShowChange}>
        Content
      </Popup>,
    )

    fireEvent.tap(asElement(getByText('Content')))
    expect(onShowChange).not.toHaveBeenCalled()
  })

  it('supports bottom position', () => {
    const { container } = render(
      <Popup show position="bottom">
        Bottom Sheet
      </Popup>,
    )

    const content = container.firstChild?.lastChild
    expect(content).toHaveClass('lu-popup__content--bottom')
  })

  it('supports round corners', () => {
    const { container } = render(
      <Popup show round>
        Rounded
      </Popup>,
    )

    const content = container.firstChild?.lastChild
    expect(content).toHaveClass('lu-popup__content--round')
  })

  it('can hide the overlay', () => {
    const { container } = render(
      <Popup show={false} overlay={false} lazyRender={false}>
        No Overlay
      </Popup>,
    )

    const wrapper = container.firstChild
    expect(wrapper).toBeInTheDocument()
    expect(wrapper?.querySelector('.lu-popup__overlay')).toBeNull()
  })

  it('emits lifecycle callbacks', () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()
    const { rerender } = render(
      <Popup show={false} onOpen={onOpen} onClose={onClose}>
        Lifecycle
      </Popup>,
    )

    rerender(<Popup show onOpen={onOpen} onClose={onClose}>Lifecycle</Popup>)
    expect(onOpen).toHaveBeenCalledTimes(1)

    rerender(<Popup show={false} onOpen={onOpen} onClose={onClose}>Lifecycle</Popup>)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
