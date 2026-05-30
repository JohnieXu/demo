import { useState } from '@lynx-js/react'
import './ListDemo.scss'

interface DemoItem {
  id: string
  title: string
  subtitle: string
}

const mockData: DemoItem[] = [
  { id: '1', title: 'Item 1', subtitle: 'Direct child of list' },
  { id: '2', title: 'Item 2', subtitle: 'Direct child of list' },
  { id: '3', title: 'Item 3', subtitle: 'Direct child of list' },
  { id: '4', title: 'Item 4', subtitle: 'Direct child of list' },
  { id: '5', title: 'Item 5', subtitle: 'Direct child of list' },
]

/**
 * Demo page to validate list/list-item behavior in Lynx
 *
 * Key question: Must list-item be a direct child of list?
 *
 * Case A: list > view > list-item ❓
 * Case B: list > list-item ✅
 */
export function ListDemo() {
  const [mode, setMode] = useState<'nested' | 'direct'>('direct')

  return (
    <view className="list-demo">
      <view className="list-demo__header">
        <text className="list-demo__title">List/List-Item Demo</text>
        <text className="list-demo__subtitle">
          Testing whether list-item must be direct child of list
        </text>
      </view>

      <view className="list-demo__toggle">
        <view
          className={`list-demo__toggle-btn ${mode === 'nested' ? 'active' : ''}`}
          bindtap={() => setMode('nested')}
        >
          <text>Case A: list {'>'} view {'>'} list-item</text>
        </view>
        <view
          className={`list-demo__toggle-btn ${mode === 'direct' ? 'active' : ''}`}
          bindtap={() => setMode('direct')}
        >
          <text>Case B: list {'>'} list-item</text>
        </view>
      </view>

      <view className="list-demo__info">
        <text className="list-demo__info-text">
          Current mode: {mode === 'nested' ? 'Nested (view wrapper)' : 'Direct (no wrapper)'}
        </text>
      </view>

      {mode === 'nested' ? (
        <list
          className="list-demo__list"
          scroll-orientation="vertical"
          list-type="single"
          span-count={1}
          show-scroll-bar={true}
        >
          <view className="list-demo__content">
            {mockData.map((item) => (
              <list-item key={item.id} item-key={item.id}>
                <view className="list-demo__item">
                  <text className="list-demo__item-title">{item.title}</text>
                  <text className="list-demo__item-subtitle">{item.subtitle}</text>
                </view>
              </list-item>
            ))}
          </view>
        </list>
      ) : (
        <list
          className="list-demo__list"
          scroll-orientation="vertical"
          list-type="single"
          span-count={1}
          show-scroll-bar={true}
        >
          {mockData.map((item) => (
            <list-item key={item.id} item-key={item.id} className="list-demo__item">
              <text className="list-demo__item-title">{item.title}</text>
              <text className="list-demo__item-subtitle">{item.subtitle}</text>
            </list-item>
          ))}
        </list>
      )}
    </view>
  )
}