import { Tabs, Tab } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function TabsDemo() {
  return (
    <view>
      <DemoBlock title="线型标签 Line">
        <Tabs>
          <Tab title="标签 1" name="1">内容 1</Tab>
          <Tab title="标签 2" name="2">内容 2</Tab>
          <Tab title="标签 3" name="3">内容 3</Tab>
        </Tabs>
      </DemoBlock>

      <DemoBlock title="卡片标签 Card">
        <Tabs type="card">
          <Tab title="标签 A" name="a">内容 A</Tab>
          <Tab title="标签 B" name="b">内容 B</Tab>
          <Tab title="标签 C" name="c" disabled>内容 C</Tab>
        </Tabs>
      </DemoBlock>
    </view>
  )
}
