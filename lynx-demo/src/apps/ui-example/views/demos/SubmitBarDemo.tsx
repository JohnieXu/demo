import { useState } from '@lynx-js/react'
import { Button, SubmitBar, showToast } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function SubmitBarDemo() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    showToast({ message: '提交订单', duration: 1500 })
  }

  const handleLoadingSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      showToast({ message: '提交完成', duration: 1500 })
    }, 1500)
  }

  return (
    <view>
      <DemoBlock title="基础用法">
        <SubmitBar
          price={3050}
          buttonText="提交订单"
          onSubmit={handleSubmit}
          safeAreaInsetBottom={false}
          style={{ position: 'relative' }}
        />
      </DemoBlock>

      <DemoBlock title="提示与后缀">
        <SubmitBar
          price={9980}
          tip="您的收货地址不支持同城配，已为您推荐快递"
          suffixLabel=".00"
          buttonText="结算"
          safeAreaInsetBottom={false}
          style={{ position: 'relative' }}
        />
      </DemoBlock>

      <DemoBlock title="加载与禁用">
        <view className="demo-row">
          <Button
            label={loading ? '加载中' : '触发加载'}
            onClick={handleLoadingSubmit}
          />
        </view>
        <SubmitBar
          price={1999}
          loading={loading}
          buttonText="提交订单"
          safeAreaInsetBottom={false}
          style={{ position: 'relative', marginTop: '12px' }}
        />
        <SubmitBar
          price={1999}
          disabled
          buttonText="不可提交"
          safeAreaInsetBottom={false}
          style={{ position: 'relative', marginTop: '12px' }}
        />
      </DemoBlock>

      <DemoBlock title="自定义按钮">
        <SubmitBar
          price={5990}
          label="实付："
          buttonText="立即支付"
          buttonType="warning"
          decimalLength={0}
          safeAreaInsetBottom={false}
          style={{ position: 'relative' }}
        />
        <SubmitBar
          price={2990}
          buttonText="渐变按钮"
          buttonColor="linear-gradient(to right, #ff6034, #ee0a24)"
          safeAreaInsetBottom={false}
          style={{ position: 'relative', marginTop: '12px' }}
        />
      </DemoBlock>

      <DemoBlock title="占位块 placeholder">
        <SubmitBar
          price={12800}
          placeholder
          buttonText="确认下单"
          onSubmit={handleSubmit}
          safeAreaInsetBottom={false}
        />
      </DemoBlock>
    </view>
  )
}
