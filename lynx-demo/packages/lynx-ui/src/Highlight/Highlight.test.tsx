import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Highlight } from './Highlight'

describe('Highlight', () => {
  it('renders highlighted chunks', () => {
    const { container } = render(
      <Highlight
        sourceString="The quick brown fox"
        keywords="brown"
      />,
    )
    expect(container.firstChild).toHaveClass('lu-highlight')
    expect(container.querySelector('.lu-highlight__tag')).toHaveTextContent('brown')
  })

  it('supports multiple keywords', () => {
    const { container } = render(
      <Highlight
        sourceString="Hello world hello again"
        keywords={['world', 'again']}
      />,
    )
    const tags = container.querySelectorAll('.lu-highlight__tag')
    expect(tags).toHaveLength(2)
  })

  it('supports custom render prop', () => {
    const { container } = render(
      <Highlight
        sourceString="abc"
        keywords="b"
      >
        {(chunks) => chunks.map((c) => (c.highlight ? `*${c.text}*` : c.text)).join('')}
      </Highlight>,
    )
    expect(container.firstChild).toHaveTextContent('a*b*c')
  })
})
