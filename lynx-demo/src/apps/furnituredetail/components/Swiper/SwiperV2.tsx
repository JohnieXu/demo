import { type ReactNode, runOnMainThread, useEffect, useRef } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";
import clsx from "clsx";
import { SwiperItem } from "./SwiperItem";
import "./Swiper.scss";
import { useSwiper } from "../../hooks/useSwiper";

function useInterval(timeout: number, callback: () => void) {
  const id = useRef<number>()
  const start = () => {
    "background only";
    if (id.current) { clearInterval(id.current) }
    id.current = setInterval(callback, timeout) as unknown as number
    return () => {
      if (id.current) { clearInterval(id.current) }
    }
  }
  return {
    interval: start
  }
}

export interface SwiperProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  data: string[];
  itemWidth?: number;
}

export function Swiper(props: SwiperProps) {
  const { className, style, itemWidth = SystemInfo.pixelWidth / SystemInfo.pixelRatio, data } = props;
  const { swiperRef, handleTouchStart, handleTouchMove, handleTouchEnd, next } = useSwiper({ itemWidth, count: data.length })
  const { interval } = useInterval(1000, () => {
    "background only";
    runOnMainThread(next)()
  })

  useEffect(() => {
    return interval()
  }, [interval])

  return (
    <view className={clsx('swiper', className)} style={style}>
      <view
        className="swiper-container"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        main-thread:ref={swiperRef as any}
        main-thread:bindtouchmove={handleTouchMove}
        main-thread:bindtouchstart={handleTouchStart}
        main-thread:bindtouchend={handleTouchEnd}
      >
        {
          data.map((picUrl, index) => {
            return <SwiperItem key={index} itemWidth={itemWidth} picUrl={picUrl}></SwiperItem>
          })
        }
      </view>
    </view>
  )
}
