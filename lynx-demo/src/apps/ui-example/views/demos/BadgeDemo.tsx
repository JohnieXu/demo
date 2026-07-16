import { Badge } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

function Box() {
  return (
    <view
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        backgroundColor: 'var(--lu-color-primary-subtle)',
      }}
    />
  )
}

export function BadgeDemo() {
  return (
    <view>
      <DemoBlock title="基础用法">
        <view className="demo-row--center">
          <Badge content={5}>
            <Box />
          </Badge>
          <Badge content={120} max={99}>
            <Box />
          </Badge>
          <Badge dot>
            <Box />
          </Badge>
        </view>
      </DemoBlock>

      <DemoBlock title="位置">
        <view className="demo-row--center">
          <Badge content={1} position="top-left">
            <Box />
          </Badge>
          <Badge content={2} position="top-right">
            <Box />
          </Badge>
          <Badge content={3} position="bottom-left">
            <Box />
          </Badge>
          <Badge content={4} position="bottom-right">
            <Box />
          </Badge>
        </view>
      </DemoBlock>

      <DemoBlock title="自定义颜色与偏移">
        <view className="demo-row--center">
          <Badge content={8} color="#07c160" offset={[4, 4]}>
            <Box />
          </Badge>
        </view>
      </DemoBlock>
    </view>
  )
}
