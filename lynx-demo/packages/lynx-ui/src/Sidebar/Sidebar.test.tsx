import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'
import { Sidebar } from './Sidebar'
import { SidebarItem } from '../SidebarItem'

describe('Sidebar', () => {
  it('renders with BEM class', () => {
    const { container } = render(
      <Sidebar>
        <SidebarItem title="Item 1" />
      </Sidebar>,
    )
    expect(container.firstChild).toHaveClass('lu-sidebar')
  })

  it('updates active item on tap', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Sidebar onChange={onChange}>
        <SidebarItem title="Item 1" />
        <SidebarItem title="Item 2" />
      </Sidebar>,
    )
    const items = container.querySelectorAll('.lu-sidebar-item')
    fireEvent.tap(items[1]!)
    expect(onChange).toHaveBeenCalledWith(1)
  })
})
