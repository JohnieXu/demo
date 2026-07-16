import { useState } from '@lynx-js/react'
import { CouponCell, showToast } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

const coupons = [
  { name: '无门槛券', value: 150 },
  { name: '满减券', value: 300 },
]

export function CouponCellDemo() {
  const [chosen, setChosen] = useState(-1)

  const handleClick = () => {
    showToast({ message: '打开优惠券面板', duration: 1500 })
  }

  const toggleCoupon = () => {
    setChosen((prev) => (prev === 0 ? -1 : 0))
  }

  return (
    <view>
      <DemoBlock title="无可用优惠券">
        <CouponCell coupons={[]} chosenCoupon={-1} />
      </DemoBlock>

      <DemoBlock title="未选择">
        <CouponCell coupons={coupons} chosenCoupon={-1} />
      </DemoBlock>

      <DemoBlock title="单选优惠券">
        <CouponCell
          coupons={coupons}
          chosenCoupon={chosen}
          onClick={toggleCoupon}
        />
      </DemoBlock>

      <DemoBlock title="多选优惠券">
        <CouponCell
          coupons={coupons}
          chosenCoupon={[0, 1]}
          onClick={handleClick}
        />
      </DemoBlock>

      <DemoBlock title="自定义标题与币种">
        <CouponCell
          title=" voucher"
          currency="$"
          coupons={[{ name: 'USD', value: 199 }]}
          chosenCoupon={0}
        />
      </DemoBlock>
    </view>
  )
}
