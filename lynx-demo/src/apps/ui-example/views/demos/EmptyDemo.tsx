import { Empty } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function EmptyDemo() {
  return (
    <view>
      <DemoBlock title="基础用法">
        <Empty description="暂无数据" />
      </DemoBlock>

      <DemoBlock title="错误类型">
        <Empty image="error" description="加载失败" />
      </DemoBlock>

      <DemoBlock title="搜索类型">
        <Empty image="search" description="搜索结果为空" />
      </DemoBlock>

      <DemoBlock title="网络类型">
        <Empty image="network" description="网络异常" />
      </DemoBlock>

      <DemoBlock title="自定义底部">
        <Empty description="暂无订单">
          <text style={{ color: 'var(--lu-color-primary)', fontSize: 14 }}>去逛逛</text>
        </Empty>
      </DemoBlock>
    </view>
  )
}
