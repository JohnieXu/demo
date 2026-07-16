import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Dialog } from './Dialog'

function asElement(value: unknown): Element {
  return value as Element
}

describe('Dialog', () => {
  it('renders title and message', () => {
    const { getByText } = render(
      <Dialog show title="Hello" message="World" />,
    )

    expect(getByText('Hello')).toBeInTheDocument()
    expect(getByText('World')).toBeInTheDocument()
  })

  it('renders children instead of message', () => {
    const { getByText, queryByText } = render(
      <Dialog show message="Ignored">Custom content</Dialog>,
    )

    expect(getByText('Custom content')).toBeInTheDocument()
    expect(queryByText('Ignored')).toBeNull()
  })

  it('calls onConfirm and closes when confirm button is tapped', () => {
    const onConfirm = vi.fn()
    const onShowChange = vi.fn()
    const { container } = render(
      <Dialog
        show
        showCancelButton
        onConfirm={onConfirm}
        onShowChange={onShowChange}
      />,
    )

    const confirm = container.querySelector('.lu-dialog__confirm .lu-btn')
    fireEvent.tap(asElement(confirm))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onShowChange).toHaveBeenCalledWith(false)
  })

  it('calls onCancel and closes when cancel button is tapped', () => {
    const onCancel = vi.fn()
    const onShowChange = vi.fn()
    const { container } = render(
      <Dialog
        show
        showCancelButton
        onCancel={onCancel}
        onShowChange={onShowChange}
      />,
    )

    const cancel = container.querySelector('.lu-dialog__cancel .lu-btn')
    fireEvent.tap(asElement(cancel))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onShowChange).toHaveBeenCalledWith(false)
  })

  it('closes when overlay is tapped', () => {
    const onShowChange = vi.fn()
    const onClickOverlay = vi.fn()
    const { container } = render(
      <Dialog
        show
        onShowChange={onShowChange}
        onClickOverlay={onClickOverlay}
      />,
    )

    const overlay = container.querySelector('.lu-popup__overlay')
    fireEvent.tap(asElement(overlay))
    expect(onClickOverlay).toHaveBeenCalledTimes(1)
    expect(onShowChange).toHaveBeenCalledWith(false)
  })

  it('does not close when overlay tap is disabled', () => {
    const onShowChange = vi.fn()
    const onClickOverlay = vi.fn()
    const { container } = render(
      <Dialog
        show
        closeOnClickOverlay={false}
        onShowChange={onShowChange}
        onClickOverlay={onClickOverlay}
      />,
    )

    fireEvent.tap(asElement(container.querySelector('.lu-popup__overlay')))
    expect(onClickOverlay).toHaveBeenCalledTimes(1)
    expect(onShowChange).not.toHaveBeenCalled()
  })

  it('uses custom button texts', () => {
    const { getByText } = render(
      <Dialog
        show
        showCancelButton
        confirmButtonText="Yes"
        cancelButtonText="No"
      />,
    )

    expect(getByText('Yes')).toBeInTheDocument()
    expect(getByText('No')).toBeInTheDocument()
  })

  it('applies round-button theme modifier', () => {
    const { container } = render(<Dialog show theme="round-button" />)

    expect(container.querySelector('.lu-dialog--round-button')).toBeInTheDocument()
  })

  it('hides buttons when configured', () => {
    const { container } = render(
      <Dialog show showConfirmButton={false} showCancelButton={false} />,
    )

    expect(container.querySelector('.lu-dialog__confirm')).toBeNull()
    expect(container.querySelector('.lu-dialog__cancel')).toBeNull()
  })
})
