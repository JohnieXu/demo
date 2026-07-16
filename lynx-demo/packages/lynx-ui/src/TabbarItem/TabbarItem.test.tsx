import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'
import { Tabbar } from '../Tabbar'
import { TabbarItem } from './TabbarItem'

describe('TabbarItem', () => {
  it('renders text', () => {
    const { getByText } = render(
      <Tabbar>
        <TabbarItem icon="home-o">Home</TabbarItem>
      </Tabbar>,
    )
    expect(getByText('Home')).toBeInTheDocument()
  })

  it('applies active class', () => {
    const { container } = render(
      <Tabbar active={0}>
        <TabbarItem icon="home-o">Home</TabbarItem>
      </Tabbar>,
    )
    expect(container.querySelector('.lu-tabbar-item')).toHaveClass('lu-tabbar-item--active')
  })

  it('calls onClick with index', () => {
    const onClick = vi.fn()
    const { container } = render(
      <Tabbar>
        <TabbarItem icon="home-o" onClick={onClick}>Home</TabbarItem>
      </Tabbar>,
    )
    fireEvent.tap(container.querySelector('.lu-tabbar-item')!)
    expect(onClick).toHaveBeenCalledWith(0)
  })
})
