import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Space } from './Space'

describe('Space', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Space>
        <text>A</text>
        <text>B</text>
      </Space>,
    )
    expect(getByText('A')).toBeInTheDocument()
    expect(getByText('B')).toBeInTheDocument()
  })

  it('applies direction and align classes', () => {
    const { container } = render(
      <Space direction="vertical" align="start">
        <text>A</text>
      </Space>,
    )
    expect(container.firstChild).toHaveClass('lu-space--vertical')
    expect(container.firstChild).toHaveClass('lu-space--align-start')
  })

  it('applies wrap and fill classes', () => {
    const { container } = render(
      <Space wrap fill>
        <text>A</text>
      </Space>,
    )
    expect(container.firstChild).toHaveClass('lu-space--wrap')
    expect(container.firstChild).toHaveClass('lu-space--fill')
  })

  it('wraps each child in a space item', () => {
    const { container } = render(
      <Space>
        <text>A</text>
      </Space>,
    )
    const item = container.querySelector('.lu-space-item')
    expect(item).toBeInTheDocument()
  })
})
