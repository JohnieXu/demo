import { useState } from '@lynx-js/react'
import { Rate, showToast } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function RateDemo() {
  const [value, setValue] = useState(3)

  return (
    <view>
      <DemoBlock title="基础用法">
        <Rate value={value} onChange={setValue} />
      </DemoBlock>

      <DemoBlock title="半星">
        <Rate allowHalf defaultValue={2.5} />
      </DemoBlock>

      <DemoBlock title="自定义数量与颜色">
        <Rate
          count={7}
          defaultValue={5}
          color="#ff5712"
          voidColor="#cccccc"
        />
      </DemoBlock>

      <DemoBlock title="只读与禁用">
        <Rate readonly value={4} />
        <view style={{ height: '12px' }} />
        <Rate disabled value={3} />
      </DemoBlock>

      <DemoBlock title="事件">
        <Rate
          onChange={(val) => showToast({ message: `评分：${val}`, duration: 1000 })}
        />
      </DemoBlock>
    </view>
  )
}
