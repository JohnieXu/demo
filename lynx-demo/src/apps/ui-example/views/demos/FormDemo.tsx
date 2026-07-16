import { useState } from '@lynx-js/react'
import { Button, Field, Form, useForm, showToast } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function FormDemo() {
  const form = useForm()
  const [result, setResult] = useState('')

  const handleFinish = (values: Record<string, unknown>) => {
    const text = JSON.stringify(values)
    setResult(text)
    showToast({ message: '提交成功', duration: 1500 })
  }

  const handleFinishFailed = () => {
    showToast({ message: '请检查表单', duration: 1500 })
  }

  return (
    <view>
      <DemoBlock title="基础用法">
        <Form
          form={form}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        >
          <Field
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          />
          <Field
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              {
                pattern: /^\S+@\S+\.\S+$/,
                message: '邮箱格式不正确',
              },
            ]}
          />
          <Field
            name="phone"
            label="手机"
            type="tel"
            placeholder="请输入手机号"
            maxlength={11}
          />
        </Form>

        <view className="demo-row" style={{ padding: '12px 16px' }}>
          <Button label="提交" onClick={form.submit} />
          <Button
            style={{ marginLeft: '12px' }}
            label="重置"
            type="default"
            onClick={form.reset}
          />
        </view>

        {result && (
          <view style={{ padding: '12px 16px' }}>
            <text>结果：{result}</text>
          </view>
        )}
      </DemoBlock>
    </view>
  )
}
