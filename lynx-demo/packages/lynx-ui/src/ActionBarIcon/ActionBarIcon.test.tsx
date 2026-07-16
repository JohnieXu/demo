import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { ActionBar } from '../ActionBar'
import { ActionBarButton } from '../ActionBarButton'
import { ActionBarIcon } from './ActionBarIcon'

describe('ActionBarIcon', () => {
  it('renders icon and text', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>'
    const { container, getByText } = render(
      <ActionBar>
        <ActionBarIcon icon={svg} text="客服" />
      </ActionBar>,
    )
    expect(container.querySelector('.lu-action-bar-icon')).toBeInTheDocument()
    expect(container.querySelector('.lu-action-bar-icon__icon')).toBeInTheDocument()
    expect(getByText('客服')).toBeInTheDocument()
  })

  it('calls onClick when tapped', () => {
    const onClick = vi.fn()
    const { container } = render(
      <ActionBar>
        <ActionBarIcon text="客服" onClick={onClick} />
        <ActionBarButton text="购买" />
      </ActionBar>,
    )
    const icon = container.querySelector('.lu-action-bar-icon')
    fireEvent.tap(icon!)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders badge content', () => {
    const { container } = render(
      <ActionBar>
        <ActionBarIcon text="购物车" badge={5} />
      </ActionBar>,
    )
    expect(container).toHaveTextContent('5')
    expect(container.querySelector('.lu-badge')).toBeInTheDocument()
  })

  it('renders dot badge', () => {
    const { container } = render(
      <ActionBar>
        <ActionBarIcon text="消息" dot />
      </ActionBar>,
    )
    expect(container.querySelector('.lu-badge--dot')).toBeInTheDocument()
  })

  it('computes first and last boundaries alongside buttons', () => {
    const { container } = render(
      <ActionBar>
        <ActionBarIcon text="首页" />
        <ActionBarIcon text="购物车" />
        <ActionBarButton text="立即购买" />
      </ActionBar>,
    )
    const icons = container.querySelectorAll('.lu-action-bar-icon')
    expect(icons.length).toBe(2)
    expect(icons[0]).toHaveClass('lu-action-bar-icon--first')
    expect(icons[0]).toHaveClass('lu-action-bar-icon--last')
    expect(icons[1]).toHaveClass('lu-action-bar-icon--first')
    expect(icons[1]).not.toHaveClass('lu-action-bar-icon--last')
  })
})
