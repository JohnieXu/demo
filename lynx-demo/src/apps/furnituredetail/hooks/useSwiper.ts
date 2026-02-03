import { useMainThreadRef } from "@lynx-js/react"
import type { BaseTouchEvent } from "@lynx-js/types"
import type { MainThread } from "@lynx-js/types"
import { useAnimation } from "./useAnimation"

export function useSwiper({ 
  itemWidth, 
  count, 
  // auto = false,
  // interval = 3000,
  direction = 'left',
}: { 
  itemWidth: number, 
  count: number, 
  auto?: boolean,
  interval?: number,
  direction?: 'left' | 'right'
}) {

    const swiperRef = useMainThreadRef<MainThread.Element>()
    const startOffset = useMainThreadRef(0) // offset when move start
    const currentOffset = useMainThreadRef(0) // offset of the element.style.transform
    const currentIndex = useMainThreadRef(0) // index of current selected item
    const timerRef = useMainThreadRef<number | null>(null) // 定时器引用
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { animate, animateMTS } = useAnimation({
      duration: 300,
      easing: 'easeInOutQuad',
    })

    function updateStyle(offset: number) {
      "main thread";
      swiperRef.current?.setStyleProperties({ 'transform': `translateX(${offset}px)` });
    }

    function handleTouchStart(e: BaseTouchEvent<unknown>) {
        "main thread";
        // 触摸开始时清除定时器，停止自动滚动
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        startOffset.current = e.touches[0].clientX;
    }

    function handleTouchMove(e: BaseTouchEvent<unknown>) {
        "main thread";
        const delta = e.touches[0].clientX - startOffset.current;
        const offset = -currentIndex.current * itemWidth + delta;
        updateStyle(offset);
    }

    function handleTouchEnd(e: BaseTouchEvent<unknown>) {
        "main thread";
        const delta = e.touches[0].clientX - startOffset.current;
        if (Math.abs(delta) / itemWidth > 0.3) {
          const offset = -currentIndex.current * itemWidth + delta;
          let index = Math.round(offset / itemWidth);
          
          // 计算新的索引，支持无缝滚动
          if (delta > 0) {
            // 向右滑动
            index = currentIndex.current - 1;
            if (index < 0) {
              index = count - 1;
            }
          } else {
            // 向左滑动
            index = currentIndex.current + 1;
            if (index >= count) {
              index = 0;
            }
          }
          
          currentIndex.current = index;
          currentOffset.current = -index * itemWidth;
          updateStyle(currentOffset.current);
        } else {
          updateStyle(-currentIndex.current * itemWidth);
        }

        // 触摸结束后，如果开启了自动滚动，重新启动定时器
        // if (auto) {
        //   startAutoScroll();
        // }
    }

    function next() {
      "main thread";
      let newIndex;
      if (direction === 'left') {
        // 向左滚动，索引增加
        newIndex = currentIndex.current + 1;
        if (newIndex >= count) {
          newIndex = 0;
        }
      } else {
        // 向右滚动，索引减少
        newIndex = currentIndex.current - 1;
        if (newIndex < 0) {
          newIndex = count - 1;
        }
      }

      currentIndex.current = newIndex;
      currentOffset.current = -newIndex * itemWidth;
      // updateStyle(currentOffset.current);
      // animate({ from: -currentIndex.current * itemWidth, to: currentOffset.current })
      animateMTS({ from: -currentIndex.current * itemWidth, to: currentOffset.current }, swiperRef)
    }

    // 自动滚动函数
    // function startAutoScroll() {
    //   "main thread";
    //   // 清除可能存在的旧定时器
    //   if (timerRef.current) {
    //     clearInterval(timerRef.current);
    //   }
  
    //   // 创建新的定时器
    //   timerRef.current = setInterval(() => {
    //     next();
    //   }, interval) as unknown as number;

    //   return () => {
    //     if (timerRef.current) {
    //       clearInterval(timerRef.current);
    //     }
    //   }
    // }

    return {
        swiperRef,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        next,
        // startAutoScroll,
    }
}