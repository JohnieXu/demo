import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Divider } from './Divider'

describe('Divider', () => {
  it('renders horizontal divider', () => {
    const { container } = render(<Divider />)
    expect(container.firstChild).toHaveClass('lu-divider')
  })

  it('renders vertical divider', () => {
    const { container } = render(<Divider vertical />)
    expect(container.firstChild).toHaveClass('lu-divider--vertical')
  })

  it('renders content with content position class', () => {
    const { getByText } = render(<Divider contentPosition="left">Text</Divider>)
    expect(getByText('Text')).toBeInTheDocument()
  })

  it('applies dashed class to lines', () => {
    const { container } = render(<Divider dashed>Text</Divider>)
    const lines = container.querySelectorAll('.lu-divider__line--dashed')
    expect(lines.length).toBe(2)
  })
})
