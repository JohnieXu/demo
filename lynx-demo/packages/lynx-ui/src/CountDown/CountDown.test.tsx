import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { CountDown } from './CountDown'

describe('CountDown', () => {
  it('renders formatted text', () => {
    const { container } = render(
      <CountDown time={3661000} format="HH:mm:ss" autoStart={false} />,
    )
    expect(container.firstChild).toHaveClass('lu-count-down')
    expect(container.firstChild).toHaveTextContent('01:01:01')
  })

  it('supports custom render prop', () => {
    const { container } = render(
      <CountDown time={5000} autoStart={false}>
        {(current) => `${current.seconds}s`}
      </CountDown>,
    )
    expect(container.firstChild).toHaveTextContent('5s')
  })
})
