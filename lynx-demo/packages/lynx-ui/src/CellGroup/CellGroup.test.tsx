import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { CellGroup } from './CellGroup'

describe('CellGroup', () => {
  it('renders children', () => {
    const { getByText } = render(
      <CellGroup>
        <view>Item</view>
      </CellGroup>,
    )
    expect(getByText('Item')).toBeInTheDocument()
  })

  it('renders title', () => {
    const { getByText } = render(
      <CellGroup title="Group Title">
        <view>Item</view>
      </CellGroup>,
    )
    expect(getByText('Group Title')).toBeInTheDocument()
  })

  it('applies inset class', () => {
    const { container } = render(
      <CellGroup inset>
        <view />
      </CellGroup>,
    )
    expect(container.firstChild).toHaveClass('lu-cell-group--inset')
  })
})
