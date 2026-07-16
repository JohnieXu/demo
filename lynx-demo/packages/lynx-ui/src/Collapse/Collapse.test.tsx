import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Collapse } from './Collapse'
import { CollapseItem } from '../CollapseItem/CollapseItem'

describe('Collapse + CollapseItem', () => {
  it('renders Collapse with multiple items', () => {
    const { container } = render(
      <Collapse defaultValue={[]}>
        <CollapseItem name="a" title="A">content-a</CollapseItem>
        <CollapseItem name="b" title="B">content-b</CollapseItem>
      </Collapse>,
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders item with title', () => {
    const { getByText } = render(
      <Collapse defaultValue={[]}>
        <CollapseItem name="a" title="Title A">content</CollapseItem>
      </Collapse>,
    )
    expect(getByText('Title A')).toBeInTheDocument()
  })
})
