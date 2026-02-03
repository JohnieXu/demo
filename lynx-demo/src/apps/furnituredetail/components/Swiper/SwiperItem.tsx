import type { CSSProperties } from "@lynx-js/types";
import "./SwiperItem.scss";

export interface SwiperItemProps {
  className?: string;
  style?: CSSProperties;
  picUrl: string;
  itemWidth: number;
}

export function SwiperItem(props: SwiperItemProps) {
  const { itemWidth, picUrl } = props
  return (
    <view className="swiper-item" style={{width: itemWidth + 'px', height: '100%'}}>
      <image src={picUrl} mode="aspectFill" style={{width: '100%', height: '100%'}}></image>
    </view>
  )
}