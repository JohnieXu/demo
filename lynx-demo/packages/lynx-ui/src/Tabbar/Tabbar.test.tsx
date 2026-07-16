import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'
import { Tabbar } from './Tabbar'
import { TabbarItem } from '../TabbarItem'

describe('Tabbar', () => {
  it('renders with BEM class', () => {
    const { container } = render(
      <Tabbar>
        <TabbarItem icon="home-o">Home</TabbarItem>
      </Tabbar>,
    )
    expect(container.firstChild).toHaveClass('lu-tabbar')
  })

  it('updates active item on tap', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Tabbar onChange={onChange}>
        <TabbarItem icon="home-o">Home</TabbarItem>
        <TabbarItem icon="search">Search</TabbarItem>
      </Tabbar>,
    )
    const items = container.querySelectorAll('.lu-tabbar-item')
    fireEvent.tap(items[1]!)
    expect(onChange).toHaveBeenCalledWith(1)
  })
})
