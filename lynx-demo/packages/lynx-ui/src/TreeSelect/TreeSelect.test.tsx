import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'
import { TreeSelect } from './TreeSelect'

describe('TreeSelect', () => {
  const items = [
    {
      text: 'Group 1',
      children: [
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
      ],
    },
    {
      text: 'Group 2',
      children: [
        { id: 3, text: 'Item 3' },
      ],
    },
  ]

  it('renders nav items', () => {
    const { getByText } = render(<TreeSelect items={items} />)
    expect(getByText('Group 1')).toBeInTheDocument()
    expect(getByText('Group 2')).toBeInTheDocument()
  })

  it('switches group on nav tap', () => {
    const onUpdateMainActiveIndex = vi.fn()
    const { container } = render(
      <TreeSelect
        items={items}
        onUpdateMainActiveIndex={onUpdateMainActiveIndex}
      />,
    )
    const navItems = container.querySelectorAll('.lu-sidebar-item')
    fireEvent.tap(navItems[1]!)
    expect(onUpdateMainActiveIndex).toHaveBeenCalledWith(1)
  })

  it('selects child item', () => {
    const onUpdateActiveId = vi.fn()
    const { container } = render(
      <TreeSelect items={items} onUpdateActiveId={onUpdateActiveId} />,
    )
    const children = container.querySelectorAll('.lu-tree-select__item')
    fireEvent.tap(children[1]!)
    expect(onUpdateActiveId).toHaveBeenCalledWith(2)
  })
})
