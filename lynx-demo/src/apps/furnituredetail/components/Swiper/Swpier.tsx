import { useMainThreadRef, useMemo, useRef, useState, type ReactNode } from "@lynx-js/react";
import type { BaseTouchEvent, CSSProperties, MainThread } from "@lynx-js/types";
import clsx from "clsx";
import { SwiperItem } from "./SwiperItem";
import "./Swiper.scss";

export interface SwiperProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  data: string[];
  itemWidth?: number;
}

export function Swiper(props: SwiperProps) {
  const { className, style, itemWidth = SystemInfo.pixelWidth / SystemInfo.pixelRatio, data } = props;
  const [index, setIndex] = useState(0);
  const swiperRef = useMainThreadRef<MainThread.Element>(null);

  const transformx = useMemo(() => {
    return -index * itemWidth;
  }, [index, itemWidth])

  const offset = useRef(0);
  const offsetStart = useRef(0);
  const indexPrev = useRef(0);
  const updateIndex = (delta: number, threshold = 0.3, onCancel?: () => void) => {
    if (delta > 0) {
      // to right
      if ((delta / itemWidth) > threshold) {
        setIndex((prev) => prev - 1 < 0 ? data.length - 1 : prev - 1);
        return;
      } else {
        onCancel?.();
      }
    } else {
      // to left
      if ((Math.abs(delta) / itemWidth) > threshold) {
        setIndex((prev) => prev + 1 >= data.length ? 0 : prev + 1);
        return;
      } else {
        onCancel?.();
      }
    }
  }
  const onTouchStart = (e: BaseTouchEvent<unknown>) => {
    console.log(e);
    offset.current = e.touches[0].clientX;
    offsetStart.current = e.touches[0].clientX;
    indexPrev.current = index;
  }

  const onTouchMove = (e: BaseTouchEvent<unknown>) => {
    const delta = e.touches[0].clientX - offsetStart.current;
    offset.current = delta;
    updateIndex(delta, 0.3);
  }

  const onTouchMoveMTS = (e: BaseTouchEvent<unknown>) => {
    "main thread";
    const delta = e.touches[0].clientX - offsetStart.current;
    const offset = index * itemWidth + delta / SystemInfo.pixelRatio;
    swiperRef.current?.setStyleProperty('transform', `translate3d(${offset}px,0,0)`);
  }

  const onTouchEnd = (e: BaseTouchEvent<unknown>) => {
    console.log(e);
    const delta = offset.current;
    updateIndex(delta, 0.3, () => {
      setIndex(indexPrev.current);
    });
    offset.current = 0
    offsetStart.current = 0;
  }

  return (
    <view className={clsx('swiper', className)} style={style}>
      <view
        className="swiper-container"
        main-thread:ref={swiperRef}
        main-thread:bindtouchmove={onTouchMoveMTS}
        bindtouchstart={onTouchStart}
        // bindtouchmove={onTouchMove}
        bindtouchend={onTouchEnd}
        style={{transform: `translate3d(${transformx}px,0,0)`}}
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
