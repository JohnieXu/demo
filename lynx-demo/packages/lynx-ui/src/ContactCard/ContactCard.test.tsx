import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { ContactCard } from './ContactCard'

describe('ContactCard', () => {
  it('renders add type with default text', () => {
    const { getByText } = render(<ContactCard />)
    expect(getByText('添加联系人')).toBeInTheDocument()
  })

  it('renders add type with custom addText', () => {
    const { getByText } = render(<ContactCard addText="新增收货人" />)
    expect(getByText('新增收货人')).toBeInTheDocument()
  })

  it('renders edit type with name and tel', () => {
    const { getByText } = render(
      <ContactCard type="edit" name="张三" tel="13800138000" />,
    )
    expect(getByText('姓名：张三')).toBeInTheDocument()
    expect(getByText('电话：13800138000')).toBeInTheDocument()
  })

  it('shows arrow link when editable is true', () => {
    const { container } = render(<ContactCard editable />)
    expect(container.querySelector('.lu-cell__arrow')).toBeInTheDocument()
  })

  it('hides arrow link when editable is false', () => {
    const { container } = render(<ContactCard editable={false} />)
    expect(container.querySelector('.lu-cell__arrow')).not.toBeInTheDocument()
  })

  it('calls onClick when editable and tapped', () => {
    const onClick = vi.fn()
    const { container } = render(<ContactCard onClick={onClick} />)
    fireEvent.tap(container.firstChild!)
    expect(onClick).toHaveBeenCalled()
  })

  it('does not call onClick when not editable and tapped', () => {
    const onClick = vi.fn()
    const { container } = render(
      <ContactCard editable={false} onClick={onClick} />,
    )
    fireEvent.tap(container.firstChild!)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies type modifier class', () => {
    const { container } = render(<ContactCard type="edit" />)
    expect(container.firstChild).toHaveClass('lu-contact-card--edit')
  })
})
