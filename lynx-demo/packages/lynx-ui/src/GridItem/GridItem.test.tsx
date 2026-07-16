import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Grid } from '../Grid'
import { GridItem } from './GridItem'

describe('GridItem', () => {
  it('renders text and icon content', () => {
    const { container } = render(
      <Grid columnNum={2}>
        <GridItem icon="home" text="Home" />
      </Grid>,
    )
    expect(container.firstChild).toHaveTextContent('Home')
    expect(container.querySelector('.lu-grid-item__icon')).toBeInTheDocument()
  })

  it('fires onClick when tapped', () => {
    const onClick = vi.fn()
    const { container } = render(
      <Grid columnNum={2}>
        <GridItem text="Tap me" onClick={onClick} />
      </Grid>,
    )
    const content = container.querySelector('.lu-grid-item__content')
    fireEvent.tap(content!)
    expect(onClick).toHaveBeenCalled()
  })

  it('renders badge when badge prop is provided', () => {
    const { container } = render(
      <Grid columnNum={2}>
        <GridItem text="Messages" badge={5} />
      </Grid>,
    )
    expect(container.querySelector('.lu-badge')).toBeInTheDocument()
  })
})
