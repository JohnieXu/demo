import { Divider } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function DividerDemo() {
  return (
    <view>
      <DemoBlock title="基础用法">
        <view className="demo-row--center">
          <Divider />
        </view>
      </DemoBlock>

      <DemoBlock title="展示文字">
        <Divider>文字</Divider>
      </DemoBlock>

      <DemoBlock title="文字位置">
        <view style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Divider contentPosition="left">左侧文字</Divider>
          <Divider contentPosition="right">右侧文字</Divider>
        </view>
      </DemoBlock>

      <DemoBlock title="虚线">
        <Divider dashed>虚线</Divider>
      </DemoBlock>

      <DemoBlock title="垂直分割线">
        <view className="demo-row--center">
          <text>左侧</text>
          <Divider vertical />
          <text>右侧</text>
        </view>
      </DemoBlock>
    </view>
  )
}
