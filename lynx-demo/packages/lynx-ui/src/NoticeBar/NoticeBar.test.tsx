import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { NoticeBar } from './NoticeBar'

describe('NoticeBar', () => {
  it('renders with text', () => {
    const { getByText } = render(<NoticeBar text="Notice content" />)
    expect(getByText('Notice content')).toBeInTheDocument()
  })

  it('shows close icon in closeable mode', () => {
    const { container } = render(<NoticeBar text="Notice" mode="closeable" />)
    expect(container.querySelector('.lu-notice-bar__icon-close')).toBeInTheDocument()
  })

  it('shows arrow icon in link mode', () => {
    const { container } = render(<NoticeBar text="Notice" mode="link" />)
    expect(container.querySelector('.lu-notice-bar__icon-arrow')).toBeInTheDocument()
  })

  it('calls onClose when close icon tapped', () => {
    const onClose = vi.fn()
    const { container } = render(
      <NoticeBar text="Notice" mode="closeable" onClose={onClose} />,
    )
    const right = container.querySelector('.lu-notice-bar__right-icon')
    fireEvent.tap(right!)
    expect(onClose).toHaveBeenCalled()
  })
})
