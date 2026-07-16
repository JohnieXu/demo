import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { NavBar } from './NavBar'

describe('NavBar', () => {
  it('renders title', () => {
    const { getByText } = render(<NavBar title="Title" />)
    expect(getByText('Title')).toBeInTheDocument()
  })

  it('applies fixed class', () => {
    const { container } = render(<NavBar title="Title" fixed />)
    expect(container.firstChild).toHaveClass('lu-nav-bar--fixed')
  })

  it('triggers onClickLeft', () => {
    const onClickLeft = vi.fn()
    const { getByText } = render(
      <NavBar title="Title" leftText="Back" onClickLeft={onClickLeft} />,
    )
    const back = getByText('Back') as HTMLElement
    fireEvent.tap(back.parentElement ?? back)
    expect(onClickLeft).toHaveBeenCalled()
  })
})
