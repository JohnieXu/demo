import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { ActionSheet } from './ActionSheet'

function asElement(value: unknown): Element {
  return value as Element
}

const ACTIONS = [
  { name: '选项一' },
  { name: '选项二', subname: '补充说明' },
  { name: '危险', color: '#ff4d4f' },
  { name: '禁用', disabled: true },
  { name: '加载中', loading: true },
]

describe('ActionSheet', () => {
  it('renders actions, title and description', () => {
    const { getByText, container } = render(
      <ActionSheet
        show
        title="标题"
        description="这是一段描述"
        actions={ACTIONS}
        cancelText="取消"
      />,
    )

    expect(getByText('标题')).toBeInTheDocument()
    expect(getByText('这是一段描述')).toBeInTheDocument()
    expect(getByText('选项一')).toBeInTheDocument()
    expect(getByText('选项二')).toBeInTheDocument()
    expect(getByText('补充说明')).toBeInTheDocument()
    expect(getByText('取消')).toBeInTheDocument()
    expect(container.querySelector('.lu-action-sheet__header')).toBeInTheDocument()
  })

  it('calls onSelect when an action is tapped and closes by default', () => {
    const onSelect = vi.fn()
    const onShowChange = vi.fn()
    const { container } = render(
      <ActionSheet
        show
        actions={ACTIONS}
        onSelect={onSelect}
        onShowChange={onShowChange}
      />,
    )

    const firstAction = container.querySelector('.lu-action-sheet__item')
    fireEvent.tap(firstAction!)
    expect(onSelect).toHaveBeenCalledWith(ACTIONS[0], 0)
    expect(onShowChange).toHaveBeenCalledWith(false)
  })

  it('does not close when closeOnClickAction is false', () => {
    const onSelect = vi.fn()
    const onShowChange = vi.fn()
    const { container } = render(
      <ActionSheet
        show
        actions={ACTIONS}
        closeOnClickAction={false}
        onSelect={onSelect}
        onShowChange={onShowChange}
      />,
    )

    const firstAction = container.querySelector('.lu-action-sheet__item')
    fireEvent.tap(firstAction!)
    expect(onSelect).toHaveBeenCalledWith(ACTIONS[0], 0)
    expect(onShowChange).not.toHaveBeenCalled()
  })

  it('does not trigger onSelect for disabled actions', () => {
    const onSelect = vi.fn()
    const { container } = render(
      <ActionSheet show actions={ACTIONS} onSelect={onSelect} />,
    )

    const items = container.querySelectorAll('.lu-action-sheet__item')
    const disabledItem = items[3]
    expect(disabledItem).toHaveClass('lu-action-sheet__item--disabled')
    fireEvent.tap(disabledItem)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('does not trigger onSelect for loading actions', () => {
    const onSelect = vi.fn()
    const { container } = render(
      <ActionSheet show actions={ACTIONS} onSelect={onSelect} />,
    )

    const items = container.querySelectorAll('.lu-action-sheet__item')
    const loadingItem = items[4]
    expect(loadingItem).toHaveClass('lu-action-sheet__item--loading')
    fireEvent.tap(loadingItem)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('calls onCancel and closes when cancel is tapped', () => {
    const onCancel = vi.fn()
    const onShowChange = vi.fn()
    const { container } = render(
      <ActionSheet
        show
        actions={ACTIONS}
        cancelText="取消"
        onCancel={onCancel}
        onShowChange={onShowChange}
      />,
    )

    const cancelButton = container.querySelector('.lu-action-sheet__cancel')
    fireEvent.tap(cancelButton!)
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onShowChange).toHaveBeenCalledWith(false)
  })

  it('closes when close icon is tapped', () => {
    const onShowChange = vi.fn()
    const { container } = render(
      <ActionSheet show title="标题" actions={ACTIONS} onShowChange={onShowChange} />,
    )

    const closeIcon = container.querySelector('.lu-action-sheet__close')
    expect(closeIcon).toBeInTheDocument()
    fireEvent.tap(closeIcon!)
    expect(onShowChange).toHaveBeenCalledWith(false)
  })

  it('closes when overlay is tapped', () => {
    const onShowChange = vi.fn()
    const { container } = render(
      <ActionSheet show actions={ACTIONS} onShowChange={onShowChange} />,
    )

    const overlay = container.querySelector('.lu-popup__overlay')
    fireEvent.tap(overlay!)
    expect(onShowChange).toHaveBeenCalledWith(false)
  })

  it('does not close when overlay tap is disabled', () => {
    const onShowChange = vi.fn()
    const onClickOverlay = vi.fn()
    const { container } = render(
      <ActionSheet
        show
        actions={ACTIONS}
        closeOnClickOverlay={false}
        onShowChange={onShowChange}
        onClickOverlay={onClickOverlay}
      />,
    )

    const overlay = container.querySelector('.lu-popup__overlay')
    fireEvent.tap(overlay!)
    expect(onClickOverlay).toHaveBeenCalledTimes(1)
    expect(onShowChange).not.toHaveBeenCalled()
  })

  it('applies custom action color', () => {
    const { getByText } = render(
      <ActionSheet show actions={ACTIONS} />,
    )

    const dangerAction = asElement(getByText('危险')).parentElement
    expect(dangerAction).toHaveStyle({ color: '#ff4d4f' })
  })

  it('applies with-title modifier when title is set', () => {
    const { container } = render(
      <ActionSheet show title="标题" actions={ACTIONS} />,
    )

    expect(container.querySelector('.lu-popup')).toHaveClass('lu-action-sheet--with-title')
  })
})
