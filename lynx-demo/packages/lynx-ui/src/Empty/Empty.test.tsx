import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Empty } from './Empty'

describe('Empty', () => {
  it('renders description', () => {
    const { getByText } = render(<Empty description="No data" />)
    expect(getByText('No data')).toBeInTheDocument()
  })

  it('renders default preset icon', () => {
    const { container } = render(<Empty />)
    expect(container.querySelector('.lu-empty__icon--default')).toBeInTheDocument()
  })

  it('renders error preset icon', () => {
    const { container } = render(<Empty image="error" />)
    expect(container.querySelector('.lu-empty__icon--error')).toBeInTheDocument()
  })

  it('renders custom image', () => {
    const { getByText } = render(<Empty image={<text>Custom</text>} />)
    expect(getByText('Custom')).toBeInTheDocument()
  })

  it('renders bottom children', () => {
    const { getByText } = render(
      <Empty>
        <text>Bottom</text>
      </Empty>,
    )
    expect(getByText('Bottom')).toBeInTheDocument()
  })
})
