import { forwardRef, useImperativeHandle, useState } from "@lynx-js/react"
import "./Scollbar.scss"

export interface ScrollbarRef {
  adjustScrollbar(scrollbarHeight: number, scrollbarTop: number): void;
}

export const Scrollbar = forwardRef((props, ref) => {
  const [scrollbarHeight, setScrollbarHeight] = useState(0)
  const [scrollbarTop, setScrollbarTop] = useState(0)

  const adjustScrollbar = (scrollHeight: number, scrollTop: number) => {
    const listHeight = SystemInfo.pixelHeight / SystemInfo.pixelRatio - 48;
    const scrollbarHeight = listHeight * (listHeight / scrollHeight);
    const scrollbarTop = listHeight * (scrollTop / scrollHeight);
    setScrollbarHeight(scrollbarHeight)
    setScrollbarTop(scrollbarTop)
  }

  useImperativeHandle(ref, () => ({
    adjustScrollbar
  }))
  return (
    <view className="scrollbar" style={{ height: `${scrollbarHeight}px`, top: `${scrollbarTop}px` }}>
      <view className="scrollbar-effect glow"></view>
    </view>
  )
})

export default Scrollbar
