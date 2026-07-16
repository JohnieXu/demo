import { Loading } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function LoadingDemo() {
  return (
    <view>
      <DemoBlock title="加载类型">
        <view className="demo-row">
          <Loading />
          <Loading type="spinner" />
        </view>
      </DemoBlock>

      <DemoBlock title="加载文案">
        <view className="demo-row">
          <Loading>加载中...</Loading>
          <Loading type="spinner">加载中...</Loading>
        </view>
      </DemoBlock>

      <DemoBlock title="垂直排列">
        <view className="demo-row">
          <Loading vertical>加载中...</Loading>
          <Loading type="spinner" vertical>加载中...</Loading>
        </view>
      </DemoBlock>

      <DemoBlock title="自定义颜色">
        <view className="demo-row">
          <Loading color="#07c160" />
          <Loading color="#ff4d4f" type="spinner" />
        </view>
      </DemoBlock>

      <DemoBlock title="自定义大小">
        <view className="demo-row">
          <Loading size={20} />
          <Loading size={30} />
          <Loading size={40} />
        </view>
      </DemoBlock>
    </view>
  )
}
