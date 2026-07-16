import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { Field } from './Field'

function dispatchInputEvent(element: Element, value: string): void {
  const event = new Event('bindEvent:input', { bubbles: true })
  Object.defineProperty(event, 'detail', {
    value: { value },
    writable: false,
  })
  element.dispatchEvent(event)
}

describe('Field', () => {
  it('renders label and input', () => {
    const { container, getByText } = render(
      <Field label="用户名" placeholder="请输入用户名" />,
    )
    expect(getByText('用户名')).toBeInTheDocument()
    expect(container.querySelector('.lu-field__control')).toBeInTheDocument()
  })

  it('triggers onChange when input changes', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Field placeholder="请输入" onChange={onChange} />,
    )
    const input = container.querySelector('.lu-field__control') as Element
    dispatchInputEvent(input, 'hello')
    expect(onChange).toHaveBeenCalledWith('hello')
  })

  it('applies formatter on change', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Field
        placeholder="请输入"
        formatter={(val) => val.toUpperCase()}
        onChange={onChange}
      />,
    )
    const input = container.querySelector('.lu-field__control') as Element
    dispatchInputEvent(input, 'abc')
    expect(onChange).toHaveBeenCalledWith('ABC')
  })

  it('shows clear icon and clears value', () => {
    const onChange = vi.fn()
    const onClear = vi.fn()
    const { container } = render(
      <Field
        defaultValue="abc"
        clearable
        onChange={onChange}
        onClear={onClear}
      />,
    )
    const clear = container.querySelector('.lu-field__clear')
    expect(clear).toBeInTheDocument()
    fireEvent.tap(clear!)
    expect(onChange).toHaveBeenCalledWith('')
    expect(onClear).toHaveBeenCalled()
  })

  it('does not show clear icon when disabled or readonly', () => {
    const { container: disabledContainer } = render(
      <Field defaultValue="x" disabled clearable />,
    )
    expect(disabledContainer.querySelector('.lu-field__clear')).not.toBeInTheDocument()

    const { container: readonlyContainer } = render(
      <Field defaultValue="x" readonly clearable />,
    )
    expect(readonlyContainer.querySelector('.lu-field__clear')).not.toBeInTheDocument()
  })

  it('renders error message', () => {
    const { getByText } = render(
      <Field error errorMessage="必填项" />,
    )
    expect(getByText('必填项')).toBeInTheDocument()
  })

  it('applies input align class', () => {
    const { container } = render(
      <Field inputAlign="center" />,
    )
    expect(container.querySelector('.lu-field__control--center')).toBeInTheDocument()
  })

  it('renders left and right icons', () => {
    const { getByText } = render(
      <Field leftIcon={<text>L</text>} rightIcon={<text>R</text>} />,
    )
    expect(getByText('L')).toBeInTheDocument()
    expect(getByText('R')).toBeInTheDocument()
  })

  it('renders word limit', () => {
    const { container, getByText } = render(
      <Field defaultValue="abc" maxlength={10} showWordLimit />,
    )
    expect(container.querySelector('.lu-field__word-limit')).toBeInTheDocument()
    expect(getByText('3')).toBeInTheDocument()
    expect(getByText('10')).toBeInTheDocument()
  })
})
