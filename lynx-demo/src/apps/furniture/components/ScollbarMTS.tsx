import { type RefObject } from "@lynx-js/react"
import type { MainThread } from "@lynx-js/types";
import "./ScollbarMTS.scss"

// eslint-disable-next-line react-refresh/only-export-components
export function adjustScrollbarMTS(scrollHeight: number, scrollTop: number, ref: RefObject<ScrollbarMTSRef>) {
  "main thread";
  const listHeight = SystemInfo.pixelHeight / SystemInfo.pixelRatio - 48;
  const scrollbarHeight = listHeight * (listHeight / scrollHeight);
  const scrollbarTop = listHeight * (scrollTop / scrollHeight);
  ref.current?.setStyleProperty("height", `${scrollbarHeight}px`);
  ref.current?.setStyleProperty("top", `${scrollbarTop}px`);
}

export interface ScrollbarMTSProps {
  "main-thread:ref": RefObject<ScrollbarMTSRef>;
}

export type ScrollbarMTSRef = MainThread.Element;

export const ScrollbarMTS = (props: ScrollbarMTSProps) => {
  return (
    <view className="scrollbar-mts" main-thread:ref={props["main-thread:ref"]}>
      <view className="scrollbar-effect glow"></view>
    </view>
  )
}

export default ScrollbarMTS
