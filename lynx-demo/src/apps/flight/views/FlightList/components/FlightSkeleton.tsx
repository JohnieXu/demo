import './FlightSkeleton.scss';

export function FlightSkeleton() {
  return (
    <view className="flight-skeleton">
      <list scroll-orientation={'vertical'} list-type="single">
        {Array.from({ length: 6 }).map((_, index) => (
          <list-item item-key={index + ''}>
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
          </list-item>
        ))}
      </list>
    </view>
  );
}
