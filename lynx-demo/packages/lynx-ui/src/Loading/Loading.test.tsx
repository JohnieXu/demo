import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render } from '@lynx-js/react/testing-library'

import { Loading } from './Loading'

describe('Loading', () => {
  it('renders circular loading by default', () => {
    const { container } = render(<Loading />)
    expect(container.firstChild).toHaveClass('lu-loading--circular')
  })

  it('renders spinner loading', () => {
    const { container } = render(<Loading type="spinner" />)
    expect(container.firstChild).toHaveClass('lu-loading--spinner')
  })

  it('renders vertical layout', () => {
    const { container } = render(<Loading vertical>Text</Loading>)
    expect(container.firstChild).toHaveClass('lu-loading--vertical')
  })

  it('renders text children', () => {
    const { getByText } = render(<Loading>Loading...</Loading>)
    expect(getByText('Loading...')).toBeInTheDocument()
  })
})
