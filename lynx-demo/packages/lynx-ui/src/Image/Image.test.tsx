import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Image } from './Image'

describe('Image', () => {
  it('renders with src', () => {
    const { container } = render(<Image src="/foo.png" />)
    const img = container.querySelector('.lu-image__img')
    expect(img).toBeInTheDocument()
  })

  it('applies round class', () => {
    const { container } = render(<Image src="/foo.png" round />)
    expect(container.firstChild).toHaveClass('lu-image--round')
  })

  it('applies block class', () => {
    const { container } = render(<Image src="/foo.png" block />)
    expect(container.firstChild).toHaveClass('lu-image--block')
  })
})
