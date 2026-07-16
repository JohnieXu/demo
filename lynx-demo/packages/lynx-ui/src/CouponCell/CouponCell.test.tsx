import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@lynx-js/react/testing-library'

import { CouponCell } from './CouponCell'

const coupons = [
  { name: 'Coupon 1', value: 100 },
  { name: 'Coupon 2', value: 200 },
  { name: 'Coupon 3', denominations: 300 },
]

describe('CouponCell', () => {
  it('renders selected value with single chosenCoupon', () => {
    const { getByText } = render(
      <CouponCell coupons={coupons} chosenCoupon={1} />,
    )
    expect(getByText('-¥ 2.00')).toBeInTheDocument()
  })

  it('renders selected value with multiple chosenCoupon', () => {
    const { getByText } = render(
      <CouponCell coupons={coupons} chosenCoupon={[0, 2]} />,
    )
    expect(getByText('-¥ 4.00')).toBeInTheDocument()
  })

  it('falls back to denominations when value is undefined', () => {
    const { getByText } = render(
      <CouponCell coupons={coupons} chosenCoupon={2} />,
    )
    expect(getByText('-¥ 3.00')).toBeInTheDocument()
  })

  it('renders no coupon text when no coupons are available', () => {
    const { getByText } = render(<CouponCell coupons={[]} />)
    expect(getByText('暂无可用优惠券')).toBeInTheDocument()
  })

  it('renders available coupon count when none is chosen', () => {
    const { getByText } = render(<CouponCell coupons={coupons} />)
    expect(getByText('3张可用')).toBeInTheDocument()
  })

  it('applies selected value class when coupon is chosen', () => {
    const { container } = render(
      <CouponCell coupons={coupons} chosenCoupon={0} />,
    )
    expect(container.querySelector('.lu-coupon-cell__value--selected')).toBeInTheDocument()
  })

  it('renders arrow when editable is true', () => {
    const { container } = render(
      <CouponCell coupons={coupons} editable />,
    )
    expect(container.querySelector('.lu-cell__arrow')).toBeInTheDocument()
  })

  it('does not render arrow when editable is false', () => {
    const { container } = render(
      <CouponCell coupons={coupons} editable={false} />,
    )
    expect(container.querySelector('.lu-cell__arrow')).not.toBeInTheDocument()
  })

  it('applies borderless class when border is false', () => {
    const { container } = render(
      <CouponCell coupons={coupons} border={false} />,
    )
    expect(container.firstChild).toHaveClass('lu-cell--borderless')
  })

  it('uses custom title', () => {
    const { getByText } = render(
      <CouponCell coupons={coupons} title="Discount" />,
    )
    expect(getByText('Discount')).toBeInTheDocument()
  })

  it('uses default title when title is not provided', () => {
    const { getByText } = render(<CouponCell coupons={coupons} />)
    expect(getByText('优惠券')).toBeInTheDocument()
  })

  it('calls onClick when tapped', () => {
    const onClick = vi.fn()
    const { container } = render(
      <CouponCell coupons={coupons} onClick={onClick} />,
    )
    fireEvent.tap(container.firstChild!)
    expect(onClick).toHaveBeenCalled()
  })
})
