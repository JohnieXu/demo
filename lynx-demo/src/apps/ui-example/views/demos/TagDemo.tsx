import { useState } from '@lynx-js/react'
import { Tag } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function TagDemo() {
  const [show, setShow] = useState(true)

  return (
    <view>
      <DemoBlock title="类型 Type">
        <view className="demo-row">
          <Tag>默认</Tag>
          <Tag type="primary">主要</Tag>
          <Tag type="success">成功</Tag>
          <Tag type="danger">危险</Tag>
          <Tag type="warning">警告</Tag>
        </view>
      </DemoBlock>

      <DemoBlock title="空心样式">
        <view className="demo-row">
          <Tag plain>默认</Tag>
          <Tag type="primary" plain>主要</Tag>
          <Tag type="danger" plain>危险</Tag>
        </view>
      </DemoBlock>

      <DemoBlock title="圆角与标记">
        <view className="demo-row">
          <Tag round>圆角</Tag>
          <Tag mark type="primary">标记</Tag>
        </view>
      </DemoBlock>

      <DemoBlock title="尺寸">
        <view className="demo-row">
          <Tag size="small">小</Tag>
          <Tag size="medium">中</Tag>
          <Tag size="large">大</Tag>
        </view>
      </DemoBlock>

      <DemoBlock title="可关闭">
        <view className="demo-row">
          {show && (
            <Tag closeable onClose={() => setShow(false)}>
              点我关闭
            </Tag>
          )}
          {!show && <text className="demo-result">标签已关闭</text>}
        </view>
      </DemoBlock>

      <DemoBlock title="自定义颜色">
        <view className="demo-row">
          <Tag color="#7232dd" textColor="#fff">自定义</Tag>
          <Tag color="#7232dd" plain>空心</Tag>
        </view>
      </DemoBlock>
    </view>
  )
}
