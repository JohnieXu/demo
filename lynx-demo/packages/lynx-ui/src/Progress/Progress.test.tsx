import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Progress } from './Progress'

describe('Progress', () => {
  it('renders with BEM class and percentage width', () => {
    const { container } = render(<Progress percentage={45} />)
    expect(container.firstChild).toHaveClass('lu-progress')
    const portion = container.querySelector('.lu-progress__portion')
    expect(portion).toHaveStyle({ width: '45%' })
  })

  it('renders pivot text', () => {
    const { container } = render(<Progress percentage={60} pivotText="loading" />)
    expect(container.querySelector('.lu-progress__pivot')).toHaveTextContent('loading')
  })

  it('clamps percentage between 0 and 100', () => {
    const { container } = render(<Progress percentage={150} />)
    const portion = container.querySelector('.lu-progress__portion')
    expect(portion).toHaveStyle({ width: '100%' })
  })
})
