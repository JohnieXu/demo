import type { Picture } from "../furniturePictures";
import ImageLikeCard from "./ImageLikeCard";
import "./Gallery.scss"
import { calculateEstimatedSize } from "../../../utils";
import Scrollbar, { type ScrollbarRef } from "./Scrollbar";
import { useMainThreadRef, useRef } from "@lynx-js/react";
import type { ListScrollEvent } from "@lynx-js/types";
import ScrollbarMTS, { adjustScrollbarMTS, type ScrollbarMTSRef } from "./ScollbarMTS";

export interface GalleryProps {
  pictures: Picture[];
}

export default function Gallery(props: GalleryProps) {
  const { pictures } = props;
  const scrollbarRef = useRef<ScrollbarRef>(null)
  const scrollbarMTSRef = useMainThreadRef<ScrollbarMTSRef>(null)

  function onScroll(e: ListScrollEvent) {
    scrollbarRef.current?.adjustScrollbar(e.detail.scrollHeight, e.detail.scrollTop)
  }

  function onScrollMTS(e: ListScrollEvent) {
    "main thread";
    adjustScrollbarMTS(e.detail.scrollHeight, e.detail.scrollTop, scrollbarMTSRef)
  }
  
  return (
    <view className="gallery">
      <Scrollbar ref={scrollbarRef}></Scrollbar>
      <ScrollbarMTS main-thread:ref={scrollbarMTSRef}></ScrollbarMTS>
      <list
        className="list"
        list-type="waterfall"
        scroll-orientation="vertical"
        column-count={2}
        custom-list-name="list-container"
        bindscroll={onScroll}
        main-thread:bindscroll={onScrollMTS}
      >
        {pictures.map((picture, index) => (
          <list-item
          item-key={index + ''}
          key={index}
          estimated-main-axis-size-px={calculateEstimatedSize(picture.width, picture.height)}>
            <ImageLikeCard picture={picture}></ImageLikeCard>
          </list-item>
        ))}
      </list>
    </view>
  )
}