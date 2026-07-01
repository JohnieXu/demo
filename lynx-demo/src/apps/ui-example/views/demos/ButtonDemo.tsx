import { useState } from '@lynx-js/react'
import { Button } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function ButtonDemo() {
  const [count, setCount] = useState(0)

  return (
    <view>
      <DemoBlock title="变体 Variant">
        <view className="demo-row">
          <Button label="Primary" variant="primary" />
          <Button label="Secondary" variant="secondary" />
          <Button label="Ghost" variant="ghost" />
        </view>
      </DemoBlock>

      <DemoBlock title="尺寸 Size">
        <view className="demo-row">
          <Button label="Small" size="sm" />
          <Button label="Medium" size="md" />
          <Button label="Large" size="lg" />
        </view>
      </DemoBlock>

      <DemoBlock title="禁用 Disabled">
        <view className="demo-row">
          <Button label="Primary" disabled />
          <Button label="Ghost" variant="ghost" disabled />
        </view>
      </DemoBlock>

      <DemoBlock title="点击事件 onClick">
        <view className="demo-row">
          <Button
            label={`点击了 ${count} 次`}
            onClick={() => setCount((c) => c + 1)}
          />
        </view>
      </DemoBlock>
    </view>
  )
}
