import { Space, Tag } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function SpaceDemo() {
  return (
    <view>
      <DemoBlock title="基础用法">
        <Space>
          <Tag type="primary">标签1</Tag>
          <Tag type="success">标签2</Tag>
          <Tag type="danger">标签3</Tag>
        </Space>
      </DemoBlock>

      <DemoBlock title="垂直方向">
        <Space direction="vertical" size={12}>
          <Tag>垂直1</Tag>
          <Tag>垂直2</Tag>
          <Tag>垂直3</Tag>
        </Space>
      </DemoBlock>

      <DemoBlock title="自定义间距">
        <Space size={24}>
          <Tag>间距 24</Tag>
          <Tag>间距 24</Tag>
        </Space>
      </DemoBlock>

      <DemoBlock title="换行">
        <Space wrap size={[16, 12]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Tag key={i} type={i % 2 === 0 ? 'primary' : 'warning'}>
              标签{i + 1}
            </Tag>
          ))}
        </Space>
      </DemoBlock>
    </view>
  )
}
