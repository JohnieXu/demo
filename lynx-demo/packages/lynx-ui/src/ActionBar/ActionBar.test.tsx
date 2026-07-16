import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'
import { useContext, useEffect } from '@lynx-js/react'

import { ActionBar } from './ActionBar'
import { ActionBarContext } from './context'
import { ActionBarButton } from '../ActionBarButton'

function NonButtonChild({ className }: { className?: string }) {
  const { register } = useContext(ActionBarContext)
  useEffect(() => {
    register(false)
  }, [register])
  return <view className={className}>Icon</view>
}

describe('ActionBar', () => {
  it('renders fixed action bar with children', () => {
    const { container, getByText } = render(
      <ActionBar>
        <ActionBarButton text="Submit" />
      </ActionBar>,
    )
    expect(container.querySelector('.lu-action-bar')).toBeInTheDocument()
    expect(getByText('Submit')).toBeInTheDocument()
  })

  it('renders placeholder view when placeholder is true', () => {
    const { container } = render(
      <ActionBar placeholder>
        <ActionBarButton text="Submit" />
      </ActionBar>,
    )
    expect(container.querySelector('.lu-action-bar__placeholder')).toBeInTheDocument()
  })

  it('marks single button as first and last', () => {
    const { container } = render(
      <ActionBar>
        <ActionBarButton text="Submit" />
      </ActionBar>,
    )
    const button = container.querySelector('.lu-action-bar-button')
    expect(button).toHaveClass('lu-action-bar-button--first')
    expect(button).toHaveClass('lu-action-bar-button--last')
  })

  it('computes first and last across multiple buttons', () => {
    const { container } = render(
      <ActionBar>
        <ActionBarButton text="First" />
        <ActionBarButton text="Second" />
      </ActionBar>,
    )
    const buttons = container.querySelectorAll('.lu-action-bar-button')
    expect(buttons.length).toBe(2)
    expect(buttons[0]).toHaveClass('lu-action-bar-button--first')
    expect(buttons[0]).not.toHaveClass('lu-action-bar-button--last')
    expect(buttons[1]).not.toHaveClass('lu-action-bar-button--first')
    expect(buttons[1]).toHaveClass('lu-action-bar-button--last')
  })

  it('skips non-button children when computing first and last', () => {
    const { container } = render(
      <ActionBar>
        <ActionBarButton text="First" />
        <NonButtonChild className="custom-icon" />
        <ActionBarButton text="Second" />
        <ActionBarButton text="Third" />
      </ActionBar>,
    )
    const buttons = container.querySelectorAll('.lu-action-bar-button')
    expect(buttons.length).toBe(3)
    expect(buttons[0]).toHaveClass('lu-action-bar-button--first')
    expect(buttons[0]).toHaveClass('lu-action-bar-button--last')
    expect(buttons[1]).toHaveClass('lu-action-bar-button--first')
    expect(buttons[1]).not.toHaveClass('lu-action-bar-button--last')
    expect(buttons[2]).not.toHaveClass('lu-action-bar-button--first')
    expect(buttons[2]).toHaveClass('lu-action-bar-button--last')
  })

  it('calls onClick when button is tapped', () => {
    const onClick = vi.fn()
    const { container } = render(
      <ActionBar>
        <ActionBarButton text="Submit" onClick={onClick} />
      </ActionBar>,
    )
    const button = container.querySelector('.lu-action-bar-button')
    fireEvent.tap(button!)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
