import { useState } from '@lynx-js/react'
import { Field, showToast } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function FieldDemo() {
  const [value, setValue] = useState('')

  return (
    <view>
      <DemoBlock title="基础用法">
        <Field label="用户名" placeholder="请输入用户名" />
      </DemoBlock>

      <DemoBlock title="必填与清除">
        <Field
          label="手机号"
          placeholder="请输入手机号"
          required
          clearable
          type="tel"
          maxlength={11}
        />
      </DemoBlock>

      <DemoBlock title="受控与格式化">
        <Field
          label="车牌号"
          placeholder="请输入车牌号"
          value={value}
          clearable
          formatter={(val) => val.toUpperCase()}
          onChange={setValue}
          onClear={() => setValue('')}
        />
      </DemoBlock>

      <DemoBlock title="错误提示">
        <Field
          label="邮箱"
          placeholder="请输入邮箱"
          error
          errorMessage="邮箱格式不正确"
        />
      </DemoBlock>

      <DemoBlock title="字数统计">
        <Field
          label="备注"
          placeholder="请输入备注"
          maxlength={50}
          showWordLimit
        />
      </DemoBlock>

      <DemoBlock title="禁用与只读">
        <Field
          label="禁用"
          value="不可编辑"
          disabled
        />
        <Field
          label="只读"
          value="只读内容"
          readonly
        />
      </DemoBlock>

      <DemoBlock title="事件">
        <Field
          label="点击事件"
          placeholder="点击输入框或图标"
          clearable
          onClickInput={() => showToast({ message: '点击输入框', duration: 1000 })}
          onClear={() => showToast({ message: '已清除', duration: 1000 })}
          onConfirm={(val) => showToast({ message: `确认：${val}`, duration: 1000 })}
        />
      </DemoBlock>
    </view>
  )
}
