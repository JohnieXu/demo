import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { act, render } from '@lynx-js/react/testing-library'

import { Field } from '../Field'
import { Form } from './Form'
import { useForm } from './useForm'
import type { FormInstance } from './types'

async function dispatchInputEvent(element: Element, value: string): Promise<void> {
  await act(async () => {
    const event = new Event('bindEvent:input', { bubbles: true })
    Object.defineProperty(event, 'detail', {
      value: { value },
      writable: false,
    })
    element.dispatchEvent(event)
  })
}

describe('Form', () => {
  it('collects values and submits', async () => {
    const onFinish = vi.fn()
    let form!: FormInstance

    function Demo() {
      const f = useForm()
      form = f
      return (
        <Form form={f} onFinish={onFinish}>
          <Field name="username" />
          <Field name="email" />
        </Form>
      )
    }

    const { container } = render(<Demo />)

    const inputs = container.querySelectorAll('.lu-field__control')
    await dispatchInputEvent(inputs[0], 'admin')
    await dispatchInputEvent(inputs[1], 'admin@example.com')

    await form.submit()

    expect(onFinish).toHaveBeenCalledWith({
      username: 'admin',
      email: 'admin@example.com',
    })
  })

  it('validates required fields', async () => {
    const onFinish = vi.fn()
    const onFinishFailed = vi.fn()
    let form!: FormInstance

    function Demo() {
      const f = useForm()
      form = f
      return (
        <Form
          form={f}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Field
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          />
        </Form>
      )
    }

    render(<Demo />)

    await form.submit()

    expect(onFinish).not.toHaveBeenCalled()
    expect(onFinishFailed).toHaveBeenCalled()
    expect(form.getFieldError('username')).toBe('请输入用户名')
  })

  it('calls onValuesChange when field value changes', async () => {
    const onValuesChange = vi.fn()
    const { container } = render(
      <Form onValuesChange={onValuesChange}>
        <Field name="username" />
      </Form>,
    )

    const input = container.querySelector('.lu-field__control') as Element
    await dispatchInputEvent(input, 'hello')

    expect(onValuesChange).toHaveBeenCalledWith(
      { username: 'hello' },
      { username: 'hello' },
    )
  })

  it('useForm exposes reset and setFieldsValue', async () => {
    let form!: FormInstance

    function Demo() {
      const f = useForm()
      form = f
      return (
        <Form form={f}>
          <Field name="username" />
        </Form>
      )
    }

    const { container } = render(<Demo />)

    const input = container.querySelector('.lu-field__control') as Element
    await dispatchInputEvent(input, 'admin')

    expect(form.getFieldsValue()).toEqual({ username: 'admin' })

    await act(async () => {
      form.setFieldsValue({ username: 'guest' })
    })
    expect(form.getFieldsValue()).toEqual({ username: 'guest' })

    await act(async () => {
      form.reset()
    })
    expect(form.getFieldsValue()).toEqual({})
  })
})
