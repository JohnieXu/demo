import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { RollingText } from './RollingText'

describe('RollingText', () => {
  it('renders with BEM class and items', () => {
    const { container } = render(
      <RollingText startNum={0} targetNum={123} autoStart={false} />,
    )
    expect(container.firstChild).toHaveClass('lu-rolling-text')
    expect(container.querySelectorAll('.lu-rolling-text-item')).toHaveLength(3)
  })

  it('supports custom text list', () => {
    const { container } = render(
      <RollingText textList={['abc', 'def']} autoStart={false} />,
    )
    expect(container.querySelectorAll('.lu-rolling-text-item')).toHaveLength(3)
  })
})
