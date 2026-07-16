import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Grid } from './Grid'
import { GridItem } from '../GridItem'

describe('Grid', () => {
  it('renders with BEM class', () => {
    const { container } = render(
      <Grid columnNum={2}>
        <GridItem icon="home" text="Home" />
      </Grid>,
    )
    expect(container.firstChild).toHaveClass('lu-grid')
  })

  it('passes gutter padding to root', () => {
    const { container } = render(
      <Grid gutter={16}>
        <GridItem />
      </Grid>,
    )
    expect(container.firstChild).toHaveStyle({ paddingLeft: '16px' })
  })
})
