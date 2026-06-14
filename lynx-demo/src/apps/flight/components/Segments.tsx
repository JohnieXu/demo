 
import { clsx } from "clsx"
import { useState, useEffect, useMainThreadRef, runOnMainThread, useCallback } from "@lynx-js/react"
import type { Element } from "@lynx-js/types/main-thread"
import type { MainThread, NodesRef, SelectorQuery, TouchEvent } from "@lynx-js/types"
// import { useDialog } from "./dialog/index"
import "./Segments.scss"

export interface Segment<T extends string = string> {
  id: T;
  label: string;
}

export interface SegmentsProps<T extends string = string> {
  segments: Segment<T>[];
  activeId?: T;
  onSegmentChange?: (id: T) => void;
}

interface IndicatorStyle {
  left: number
  width: number
}

export function Segments<T extends string = string>({
  segments,
  activeId,
  onSegmentChange,
}: SegmentsProps<T>) {
  // const { showDialog } = useDialog()
  const [innerActiveId, setInnerActiveId] = useState<string | undefined>(
    activeId,
  );
  const containerRef = useMainThreadRef<Element>(null);
  const indicatorRef = useMainThreadRef<Element>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
  });

  // const updateIndicator = (id: string) => {
  //   'main thread'
  //   console.log('updateIndicator', segments, id)
  //   const container = containerRef.current
  //   const indicator = indicatorRef.current
  //   if (!container || !indicator) return

  //   const activeIdx = segments.findIndex((s) => s.id === id)
  //   if (activeIdx === -1) return

  //   const items = container.querySelectorAll('.segment-item')
  //   if (!items || items.length === 0) return

  //   const activeItem = items[activeIdx]
  //   if (!activeItem) return

  //   const containerRect = container.getBoundingClientRect
  //     ? container.getBoundingClientRect()
  //     : { left: 0 }
  //   const itemRect = activeItem.getBoundingClientRect
  //     ? activeItem.getBoundingClientRect()
  //     : { left: 0, width: 0 }

  //   const left = itemRect.left - containerRect.left
  //   const width = itemRect.width

  //   setIndicatorStyle({ left, width })

  //   indicator.setStyleProperty("transform", `translate3d(${left}px, 0, 0)`)
  //   indicator.setStyleProperty("width", `${width}px`)
  //   indicator.setStyleProperty("transition", `transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1)`)
  // }

  const updateIndicatorMTS = useCallback(
    ({ left, width }: IndicatorStyle) => {
      'main thread';
      const indicator = indicatorRef.current;
      if (!indicator) return;
      indicator.setStyleProperty('transform', `translate3d(${left}px, 0, 0)`);
      indicator.setStyleProperty('width', `${width}px`);
      indicator.setStyleProperty(
        'transition',
        `transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1)`,
      );
    },
    [indicatorRef],
  );

  useEffect(() => {
    if (activeId) {
      setInnerActiveId(activeId);
      runOnMainThread(updateIndicatorMTS)(indicatorStyle);
    }
  }, [activeId, indicatorStyle, segments, updateIndicatorMTS]);

  useEffect(() => {
    if (!innerActiveId && segments.length > 0) {
      const firstId = segments[0].id;
      setInnerActiveId(firstId);
      onSegmentChange?.(firstId);

      setTimeout(() => {
        // 等待 DOM 更新完成
        let wrapperRect: IndicatorStyle | null = null;
        let firstItemRect: IndicatorStyle | null = null;

        const updateIndicatorStyle = () => {
          if (!firstItemRect || !wrapperRect) return;
          const left = firstItemRect.left - wrapperRect.left;
          const width = firstItemRect.width;
          setIndicatorStyle({ left, width });
          runOnMainThread(updateIndicatorMTS)({ left, width });
        };

        lynx
          .createSelectorQuery()
          .select('#segments-wrapper')
          .invoke({
            method: 'boundingClientRect',
            success: (rect: IndicatorStyle) => {
              wrapperRect = rect;
              if (firstItemRect) updateIndicatorStyle();
            },
            fail: (err) => {
              console.log('boundingClientRect fail', err);
            },
          })
          .exec();

        lynx
          .createSelectorQuery()
          .select('.segment-item')
          .invoke({
            method: 'boundingClientRect',
            success: (rect: IndicatorStyle) => {
              firstItemRect = rect;
              if (wrapperRect) updateIndicatorStyle();
            },
            fail: (err) => {
              console.log('boundingClientRect fail', err);
            },
          })
          .exec();
      }, 0);
    }
  }, [segments, innerActiveId, onSegmentChange, updateIndicatorMTS]);

  const handleSegmentChangeMTS = (e: MainThread.TouchEvent) => {
    'main thread';
    return;
    const id = e.currentTarget.getAttribute('data-id') as T;
    console.log('handleSegmentChange', id);
    if (!id) return;
    onSegmentChange?.(id as T);
    updateIndicatorMTS(indicatorStyle);
  };

  const handleSegmentChange = useCallback(
    (e: TouchEvent) => {
      console.log(
        e.currentTarget,
        e.currentTarget?.uid,
        SystemInfo.engineVersion,
        SystemInfo.platform,
        SystemInfo,
      );
      const uid =
        e.currentTarget.uid ||
        (e.currentTarget as unknown as { uniqueId: number }).uniqueId;
      const id = e.currentTarget.dataset.id as string;
      console.log('handleSegmentChange', id);
      // showDialog(`id=${id} uid=${uid}`)
      if (!id) return;
      setInnerActiveId(id);
      onSegmentChange?.(id as T);
      if (!uid) return;
      let currentItemRect: IndicatorStyle | null = null;
      let wrapperRect: IndicatorStyle | null = null;

      (
        lynx.createSelectorQuery() as {
          selectUniqueID(uid: number): NodesRef;
        } & SelectorQuery
      )
        .selectUniqueID(uid)
        .invoke({
          method: 'boundingClientRect',
          success: (rect: IndicatorStyle) => {
            console.log('boundingClientRect', rect);
            currentItemRect = rect;
            updateIndicatorStyle();
          },
          fail: (err) => {
            console.log('boundingClientRect fail', err);
          },
        })
        .exec();

      lynx
        .createSelectorQuery()
        .select('#segments-wrapper')
        .invoke({
          method: 'boundingClientRect',
          success: (rect: IndicatorStyle) => {
            console.log('boundingClientRect', rect);
            wrapperRect = rect;
            updateIndicatorStyle();
          },
          fail: (err) => {
            console.log('boundingClientRect fail', err);
          },
        })
        .exec();

      function updateIndicatorStyle() {
        if (!currentItemRect || !wrapperRect) return;
        const left = currentItemRect.left - wrapperRect.left;
        const width = currentItemRect.width;
        setIndicatorStyle({ left, width });
        runOnMainThread(updateIndicatorMTS)({ left, width });
      }
    },
    [onSegmentChange, updateIndicatorMTS],
  );

  return (
    <>
      <view className="segments">
        <view
          className="segments-wrapper"
          main-thread:ref={containerRef}
          id="segments-wrapper"
        >
          <view
            className="segments-indicator"
            main-thread:ref={indicatorRef}
            id="segments-indicator"
          />
          <view className="segments-content">
            {segments.map((segment) => (
              <view
                key={segment.id}
                className={clsx(
                  'segment-item',
                  innerActiveId === segment.id && 'active',
                )}
                data-id={segment.id}
                main-thread:bindtap={handleSegmentChangeMTS}
                bindtap={handleSegmentChange}
              >
                <text
                  className={clsx(
                    'segment-label',
                    innerActiveId === segment.id && 'active',
                  )}
                >
                  {segment.label}
                </text>
              </view>
            ))}
          </view>
        </view>
      </view>
    </>
  );
}
