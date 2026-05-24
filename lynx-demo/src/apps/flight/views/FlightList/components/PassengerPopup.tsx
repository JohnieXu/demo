import { useState, useEffect } from '@lynx-js/react'
import './PassengerPopup.scss'

interface PassengerPopupProps {
  show: boolean
  adultNum: number
  childNum: number
  onClose: () => void
  onConfirm: (adult: number, child: number) => void
}

export function PassengerPopup({
  show,
  adultNum,
  childNum,
  onClose,
  onConfirm,
}: PassengerPopupProps) {
  const [adult, setAdult] = useState(adultNum)
  const [child, setChild] = useState(childNum)

  useEffect(() => {
    if (show) {
      setAdult(adultNum)
      setChild(childNum)
    }
  }, [show, adultNum, childNum])

  if (!show) return null

  const maxChild = adult * 2
  const canDecreaseAdult = adult > 1
  const canIncreaseAdult = adult < 9
  const canDecreaseChild = child > 0
  const canIncreaseChild = child < maxChild && adult + child < 9

  const handleConfirm = () => {
    onConfirm(adult, child)
  }

  return (
    <view className="passenger-popup">
      <view className="passenger-popup__overlay" bindtap={onClose} />
      <view className="passenger-popup__content">
        <view className="passenger-popup__header">
          <text className="passenger-popup__title">选择乘机人</text>
          <text className="passenger-popup__close" bindtap={onClose}>✕</text>
        </view>

        <view className="passenger-popup__body">
          <view className="passenger-popup__row">
            <view className="passenger-popup__info">
              <text className="passenger-popup__label">成人</text>
              <text className="passenger-popup__sublabel">≥12周岁</text>
            </view>
            <view className="passenger-popup__stepper">
              <view
                className={`passenger-popup__btn ${!canDecreaseAdult ? 'passenger-popup__btn--disabled' : ''}`}
                bindtap={() => canDecreaseAdult && setAdult(adult - 1)}
              >
                <text className="passenger-popup__btn-text">−</text>
              </view>
              <text className="passenger-popup__count">{adult}</text>
              <view
                className={`passenger-popup__btn ${!canIncreaseAdult ? 'passenger-popup__btn--disabled' : ''}`}
                bindtap={() => canIncreaseAdult && setAdult(adult + 1)}
              >
                <text className="passenger-popup__btn-text">+</text>
              </view>
            </view>
          </view>

          <view className="passenger-popup__row">
            <view className="passenger-popup__info">
              <text className="passenger-popup__label">儿童</text>
              <text className="passenger-popup__sublabel">2-12周岁</text>
            </view>
            <view className="passenger-popup__stepper">
              <view
                className={`passenger-popup__btn ${!canDecreaseChild ? 'passenger-popup__btn--disabled' : ''}`}
                bindtap={() => canDecreaseChild && setChild(child - 1)}
              >
                <text className="passenger-popup__btn-text">−</text>
              </view>
              <text className="passenger-popup__count">{child}</text>
              <view
                className={`passenger-popup__btn ${!canIncreaseChild ? 'passenger-popup__btn--disabled' : ''}`}
                bindtap={() => canIncreaseChild && setChild(child + 1)}
              >
                <text className="passenger-popup__btn-text">+</text>
              </view>
            </view>
          </view>

          <view className="passenger-popup__tip">
            <text className="passenger-popup__tip-text">
              儿童数量不得超过成人数量×2，总人数不超过9人
            </text>
          </view>
        </view>

        <view className="passenger-popup__footer">
          <view className="passenger-popup__confirm" bindtap={handleConfirm}>
            <text className="passenger-popup__confirm-text">确认</text>
          </view>
        </view>
      </view>
    </view>
  )
}
