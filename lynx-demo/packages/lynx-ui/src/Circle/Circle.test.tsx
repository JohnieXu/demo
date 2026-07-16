import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Circle } from './Circle'

describe('Circle', () => {
  it('renders with BEM class and svg', () => {
    const { container } = render(<Circle rate={50} text="50%" />)
    expect(container.firstChild).toHaveClass('lu-circle')
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.querySelector('.lu-circle__text')).toHaveTextContent('50%')
  })

  it('renders custom children instead of text', () => {
    const { container } = render(
      <Circle rate={30}><text className="custom">Done</text></Circle>,
    )
    expect(container.querySelector('.custom')).toHaveTextContent('Done')
  })
})
