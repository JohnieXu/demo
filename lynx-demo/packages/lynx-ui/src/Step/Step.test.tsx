import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Steps } from '../Steps'
import { Step } from './Step'

describe('Step', () => {
  it('renders BEM classes inside Steps', () => {
    const { container } = render(
      <Steps active={1}>
        <Step>Step 1</Step>
        <Step>Step 2</Step>
        <Step>Step 3</Step>
      </Steps>,
    )
    const steps = container.querySelectorAll('.lu-step')
    expect(steps).toHaveLength(3)
    expect(steps[0]).toHaveClass('lu-step--active')
    expect(steps[1]).toHaveClass('lu-step--active')
    expect(steps[1]).toHaveClass('lu-step--process')
  })
})
