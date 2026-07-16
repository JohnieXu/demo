import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders with BEM class and pages', () => {
    const { container } = render(
      <Pagination pageCount={5} modelValue={1} />,
    )
    expect(container.firstChild).toHaveClass('lu-pagination')
    expect(container.querySelectorAll('.lu-pagination__item')).toHaveLength(7) // 5 pages + prev + next
  })

  it('updates page when a page item is tapped', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Pagination pageCount={5} modelValue={1} onChange={onChange} />,
    )
    const pageItems = container.querySelectorAll('.lu-pagination__item--page')
    fireEvent.tap(pageItems[2]!)
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('renders simple mode description', () => {
    const { container } = render(
      <Pagination mode="simple" pageCount={10} modelValue={2} />,
    )
    expect(container.querySelector('.lu-pagination__page-desc')).toHaveTextContent('2/10')
  })
})
