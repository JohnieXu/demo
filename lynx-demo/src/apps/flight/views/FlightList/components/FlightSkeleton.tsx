import './FlightSkeleton.scss'

export function FlightSkeleton() {
  return (
    <view className="flight-skeleton">
      {Array.from({ length: 6 }).map((_, index) => (
        <view key={index} className="flight-skeleton__item">
          <view className="flight-skeleton__row">
            <view className="flight-skeleton__time" />
            <view className="flight-skeleton__duration" />
            <view className="flight-skeleton__time" />
            <view className="flight-skeleton__price" />
          </view>
          <view className="flight-skeleton__row">
            <view className="flight-skeleton__text" />
            <view className="flight-skeleton__text" />
          </view>
        </view>
      ))}
    </view>
  )
}
