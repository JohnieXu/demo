import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'
import { Sidebar } from '../Sidebar'
import { SidebarItem } from './SidebarItem'

describe('SidebarItem', () => {
  it('renders title', () => {
    const { getByText } = render(
      <Sidebar>
        <SidebarItem title="Nav" />
      </Sidebar>,
    )
    expect(getByText('Nav')).toBeInTheDocument()
  })

  it('applies select class when active', () => {
    const { container } = render(
      <Sidebar active={0}>
        <SidebarItem title="Nav" />
      </Sidebar>,
    )
    expect(container.querySelector('.lu-sidebar-item')).toHaveClass('lu-sidebar-item--select')
  })

  it('calls onClick with index', () => {
    const onClick = vi.fn()
    const { container } = render(
      <Sidebar>
        <SidebarItem title="Nav" onClick={onClick} />
      </Sidebar>,
    )
    fireEvent.tap(container.querySelector('.lu-sidebar-item')!)
    expect(onClick).toHaveBeenCalledWith(0)
  })
})
