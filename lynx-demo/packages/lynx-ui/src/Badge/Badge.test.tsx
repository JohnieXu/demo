import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Badge } from './Badge'

describe('Badge', () => {
  it('renders dot badge', () => {
    const { container } = render(<Badge dot><view /></Badge>)
    const badge = container.querySelector('.lu-badge--dot')
    expect(badge).toBeInTheDocument()
  })

  it('renders content and truncates by max', () => {
    const { container } = render(<Badge content={120} max={99}><view /></Badge>)
    expect(container).toHaveTextContent('99+')
  })

  it('renders standalone badge', () => {
    const { container } = render(<Badge content={5} />)
    expect(container).toHaveTextContent('5')
  })

  it('applies position class', () => {
    const { container } = render(
      <Badge content={1} position="bottom-left">
        <view />
      </Badge>,
    )
    const badge = container.querySelector('.lu-badge--bottom-left')
    expect(badge).toBeInTheDocument()
  })
})
