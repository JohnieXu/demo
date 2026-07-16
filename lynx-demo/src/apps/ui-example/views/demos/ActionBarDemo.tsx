import { useState } from '@lynx-js/react'
import { ActionBar, ActionBarButton, Icon, showToast } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

const CART_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
</svg>
`

const CHAT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
</svg>
`

export function ActionBarDemo() {
  const [loading, setLoading] = useState(false)

  const addToCart = () => {
    showToast({ message: '已加入购物车', duration: 1500 })
  }

  const buyNow = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      showToast({ message: '立即购买', duration: 1500 })
    }, 1200)
  }

  return (
    <view>
      <DemoBlock title="基础用法">
        <ActionBar
          safeAreaInsetBottom={false}
          style={{ position: 'relative' }}
        >
          <ActionBarButton text="加入购物车" onClick={addToCart} />
          <ActionBarButton text="立即购买" type="danger" onClick={buyNow} />
        </ActionBar>
      </DemoBlock>

      <DemoBlock title="图标与加载">
        <ActionBar
          safeAreaInsetBottom={false}
          style={{ position: 'relative' }}
        >
          <ActionBarButton
            text="客服"
            icon={<Icon svg={CHAT_SVG} size={16} />}
            onClick={() => showToast({ message: '联系客服', duration: 1500 })}
          />
          <ActionBarButton
            text="购物车"
            type="warning"
            icon={<Icon svg={CART_SVG} size={16} />}
            onClick={addToCart}
          />
          <ActionBarButton
            text="提交订单"
            type="danger"
            loading={loading}
            disabled={loading}
            onClick={buyNow}
          />
        </ActionBar>
      </DemoBlock>

      <DemoBlock title="禁用状态">
        <ActionBar
          safeAreaInsetBottom={false}
          style={{ position: 'relative' }}
        >
          <ActionBarButton text="暂不可购买" disabled />
        </ActionBar>
      </DemoBlock>

      <DemoBlock title="占位块 placeholder">
        <ActionBar
          placeholder
          safeAreaInsetBottom={false}
        >
          <ActionBarButton text="收藏" />
          <ActionBarButton text="去结算" type="danger" />
        </ActionBar>
      </DemoBlock>
    </view>
  )
}
