import './app.scss'
import { BounceScroll } from './components/BounceScroll'

function VerticalScrollDemo() {
  const items = Array.from({ length: 20 }, (_, i) => i + 1)

  return (
    <view className="section">
      <text className="title">垂直滚动弹性回弹</text>
      <text className="description">
        向下滚动到底部或向上滚动到顶部时，继续拖拽会产生弹性回弹效果
      </text>
      <BounceScroll className="vertical-demo" direction="vertical">
        <view className="vertical-content">
          {items.map((item) => (
            <view key={item} className="vertical-item">
              列表项 {item}
            </view>
          ))}
        </view>
      </BounceScroll>
    </view>
  )
}

function HorizontalScrollDemo() {
  const items = Array.from({ length: 15 }, (_, i) => i + 1)

  return (
    <view className="section">
      <text className="title">横向滚动弹性回弹</text>
      <text className="description">
        向右滚动到最右侧或向左滚动到最左侧时，继续拖拽会产生弹性回弹效果
      </text>
      <BounceScroll className="horizontal-demo" direction="horizontal">
        <view className="horizontal-content">
          {items.map((item) => (
            <view key={item} className="horizontal-item">
              卡片 {item}
            </view>
          ))}
        </view>
      </BounceScroll>
    </view>
  )
}

function BothScrollDemo() {
  const rows = Array.from({ length: 10 }, (_, i) => i + 1)
  const cols = Array.from({ length: 8 }, (_, i) => i + 1)

  return (
    <view className="section">
      <text className="title">双向滚动弹性回弹</text>
      <text className="description">
        支持同时垂直和横向滚动，在任意边界拖拽都会产生弹性回弹效果
      </text>
      <BounceScroll className="both-demo" direction="both">
        <view className="both-content">
          {rows.map((row) => (
            <view key={row} className="both-row">
              {cols.map((col) => (
                <view key={col} className="both-item">
                  {row}-{col}
                </view>
              ))}
            </view>
          ))}
        </view>
      </BounceScroll>
    </view>
  )
}

export function App() {
  return (
    <scroll-view className="container">
      <VerticalScrollDemo />
      <HorizontalScrollDemo />
      <BothScrollDemo />
    </scroll-view>
  )
}
