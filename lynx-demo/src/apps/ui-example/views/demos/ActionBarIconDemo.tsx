import { ActionBar, ActionBarButton, ActionBarIcon, Icon } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

const CART_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0021 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
</svg>
`

const HOME_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
</svg>
`

export function ActionBarIconDemo() {
  return (
    <view>
      <DemoBlock title="图标用法">
        <ActionBar
          safeAreaInsetBottom={false}
          style={{ position: 'relative' }}
        >
          <ActionBarIcon text="首页" icon={<Icon svg={HOME_SVG} size={18} />} />
          <ActionBarIcon text="购物车" icon={CART_SVG} badge={5} />
          <ActionBarButton text="立即购买" type="danger" />
        </ActionBar>
      </DemoBlock>

      <DemoBlock title="徽标提示">
        <ActionBar
          safeAreaInsetBottom={false}
          style={{ position: 'relative' }}
        >
          <ActionBarIcon text="客服" dot />
          <ActionBarIcon text="收藏" />
          <ActionBarButton text="加入购物车" type="warning" />
          <ActionBarButton text="提交订单" type="danger" />
        </ActionBar>
      </DemoBlock>
    </view>
  )
}
