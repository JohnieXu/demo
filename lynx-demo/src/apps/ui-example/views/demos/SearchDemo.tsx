import { useState } from '@lynx-js/react'
import { Search, showToast } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function SearchDemo() {
  const [value, setValue] = useState('')

  return (
    <view>
      <DemoBlock title="基础用法">
        <Search
          placeholder="请输入搜索关键词"
          onSearch={(val) => showToast({ message: `搜索：${val}`, duration: 1500 })}
        />
      </DemoBlock>

      <DemoBlock title="圆角搜索">
        <Search
          shape="round"
          placeholder="圆角搜索框"
        />
      </DemoBlock>

      <DemoBlock title="显示取消按钮">
        <Search
          showAction
          placeholder="请输入"
          onCancel={() => showToast({ message: '取消', duration: 1000 })}
        />
      </DemoBlock>

      <DemoBlock title="受控">
        <Search
          value={value}
          placeholder="受控搜索"
          onChange={setValue}
          onClear={() => setValue('')}
        />
      </DemoBlock>

      <DemoBlock title="禁用">
        <Search
          disabled
          value="已禁用"
        />
      </DemoBlock>
    </view>
  )
}
