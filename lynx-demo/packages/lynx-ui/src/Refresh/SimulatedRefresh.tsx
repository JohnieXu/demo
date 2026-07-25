// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License, Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMainThreadRef,
  runOnBackground,
  runOnMainThread,
} from '@lynx-js/react'
import type { BaseTouchEvent, CSSProperties } from '@lynx-js/types'
import type { Element } from '@lynx-js/types/main-thread'
import { cn } from '../theme/cn'
import type { RefreshProps, RefreshRef } from './types'

const DEFAULT_HEADER_HEIGHT = 50
const DEFAULT_THRESHOLD = 1
const RESISTANCE = 2.5
const BOUNCE_TRANSITION = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'

function readScrollTopOf(candidate: Element): number {
  'main thread';
  const raw = (candidate as unknown as { scrollTop?: unknown }).scrollTop;
  if (typeof raw === 'number') return raw;
  if (raw == null) return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Case-insensitive tag-name match for the scrollable container tags we
 * care about (`<list>`, `<scroll-view>`). Implemented with explicit string
 * equality rather than a module-level `Set` constant because Lynx's
 * main-thread / background-thread bundle split can lose module-level
 * `Set` instances at runtime (`SCROLLABLE_TAGS.has is not a function`).
 */
function isScrollableTag(tag: unknown): boolean {
  'main thread';
  if (typeof tag !== 'string') return false;
  const lower = tag.toLowerCase();
  return lower === 'list' || lower === 'scroll-view';
}

/**
 * Resolve the first scrollable descendant (a `<list>` or `<scroll-view>`)
 * inside the given element. Returns `null` when no scrollable is found.
 *
 * The native `<refresh>` element expects its second child to be a view that
 * contains a vertically scrollable element. The simulated implementation
 * mirrors that contract: it locates the first scrollable descendant and only
 * starts a pull gesture when that descendant is scrolled to the top.
 *
 * Resolution order:
 *  1. The element itself, if it is one of `<list>` / `<scroll-view>`.
 *  2. A single combined `querySelector('list, scroll-view')` traversal.
 *  3. A depth-first walk through `element.children` as a fallback for Lynx
 *     main-thread Elements where `querySelector` may not behave reliably.
 *
 * Note: this function intentionally omits a `'main thread'` directive. It
 * accesses only plain main-thread Element properties (`tagName`, `querySelector`,
 * `children`) via narrow `as unknown as` casts, so it can run transparently on
 * either thread — which the vitest harness requires to keep the function's
 * body intact for unit tests.
 */
function findScrollable(
  element: Element | null,
  cache?: { current: Element | null },
): Element | null {
  'main thread';
  if (!element) return null;

  if (cache?.current) {
    const cachedTag = (cache.current as unknown as { tagName?: unknown })
      .tagName;
    if (isScrollableTag(cachedTag)) return cache.current;
    cache.current = null;
  }

  const ownTag = (element as unknown as { tagName?: unknown }).tagName;
  if (isScrollableTag(ownTag)) {
    if (cache) cache.current = element;
    return element;
  }

  const queryFn = (
    element as unknown as {
      querySelector?: (s: string) => Element | null;
    }
  ).querySelector;
  if (typeof queryFn === 'function') {
    const found = queryFn.call(element, 'list, scroll-view');
    if (found) {
      if (cache) cache.current = found;
      return found;
    }
  }

  const kids = (element as unknown as { children?: unknown }).children;
  if (kids && Array.isArray(kids)) {
    for (let i = 0; i < kids.length; i++) {
      const kid = kids[i] as Element;
      const match = findScrollable(kid, cache);
      if (match) return match;
    }
  }

  return null;
}

/**
 * Set the vertical transform of the content view, optionally animating it.
 *
 * All style updates happen on the main thread so the gesture tracks the finger
 * with no cross-thread latency.
 */
function setContentTransform(
  contentRef: { current: Element | null | undefined },
  offset: number,
  animated: boolean,
) {
  'main thread';
  if (!contentRef.current) return;

  contentRef.current.setStyleProperty(
    'transition',
    animated ? BOUNCE_TRANSITION : 'none',
  );
  contentRef.current.setStyleProperty('transform', `translateY(${offset}px)`);
}

export const SimulatedRefresh = forwardRef<RefreshRef, RefreshProps>(
  function SimulatedRefresh(props, ref) {
    const {
      children,
      header,
      headerHeight = DEFAULT_HEADER_HEIGHT,
      threshold = DEFAULT_THRESHOLD,
      onRefresh,
      refreshing,
      enabled = true,
      className,
      style,
    } = props;

    const contentRef = useMainThreadRef<Element>();
    const scrollableRef = useMainThreadRef<Element | null>(null);
    const startYRef = useMainThreadRef(0);
    const isDraggingRef = useMainThreadRef(false);
    const pullStartedRef = useMainThreadRef(false);
    const pullOffsetRef = useMainThreadRef(0);
    const isRefreshingRef = useMainThreadRef(false);
    // ScrollTop captured at the start of the current gesture. Lets the gate
    // distinguish "already at the top" from "still has room to scroll up" so
    // pull-to-refresh only activates when the inner scrollable cannot scroll
    // anymore.
    const initialScrollTopRef = useMainThreadRef(0);
    // True once `getScrollTop` has been observed at 0 during the current
    // gesture. With `initialScrollTopRef > 0` we require this to be true
    // before the pull mode can start.
    const hasScrolledToTopRef = useMainThreadRef(false);

    const thresholdPx = headerHeight * threshold;

    // Keep the content locked or released in sync with the controlled prop.
    // refs are stable and do not need to be listed as dependencies.
    useEffect(() => {
      if (refreshing) {
        runOnMainThread(() => {
          'main thread';
          isRefreshingRef.current = true;
          setContentTransform(contentRef, headerHeight, true);
        })();
      } else {
        runOnMainThread(() => {
          'main thread';
          isRefreshingRef.current = false;
          pullStartedRef.current = false;
          hasScrolledToTopRef.current = false;
          setContentTransform(contentRef, 0, true);
        })();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshing, headerHeight]);

    useImperativeHandle(ref, () => ({
      finishRefresh() {
        runOnMainThread(() => {
          'main thread';
          isRefreshingRef.current = false;
          pullStartedRef.current = false;
          hasScrolledToTopRef.current = false;
          setContentTransform(contentRef, 0, true);
        })();
      },
      startRefresh() {
        runOnMainThread(() => {
          'main thread';
          isRefreshingRef.current = true;
          setContentTransform(contentRef, headerHeight, true);
        })();
        onRefresh?.();
      },
    }));

    function handleTouchStart(e: BaseTouchEvent<unknown>) {
      'main thread';
      if (!enabled || isRefreshingRef.current || !contentRef.current) return;

      const touch = e.touches[0];
      if (!touch) return;

      // Resolve and cache the inner scrollable now so each subsequent
      // touchmove reuses it instead of re-traversing the children tree.
      const resolved = findScrollable(contentRef.current, scrollableRef);
      if (resolved) scrollableRef.current = resolved;

      const baselineScrollTop = readScrollTopOf(
        (scrollableRef.current ?? contentRef.current) as Element,
      );

      startYRef.current = touch.clientY;
      isDraggingRef.current = true;
      pullStartedRef.current = false;
      pullOffsetRef.current = 0;
      initialScrollTopRef.current = baselineScrollTop;
      hasScrolledToTopRef.current = false;
      setContentTransform(contentRef, 0, false);
    }

    function handleTouchMove(e: BaseTouchEvent<unknown>) {
      'main thread';
      if (
        !isDraggingRef.current ||
        isRefreshingRef.current ||
        !contentRef.current
      )
        return;

      const touch = e.touches[0];
      if (!touch) return;

      const scrollTop = readScrollTopOf(
        (scrollableRef.current ?? contentRef.current) as Element,
      );
      if (scrollTop <= 0) hasScrolledToTopRef.current = true;

      const deltaY = touch.clientY - startYRef.current;

      if (!pullStartedRef.current) {
        // Only enter pull mode when the inner scrollable cannot scroll any
        // more and the finger is moving downward. When the gesture started
        // mid-scroll (initialScrollTop > 0) we additionally require that the
        // scrollable has already returned to the top during this gesture.
        const innerReachedTop =
          initialScrollTopRef.current <= 0 || hasScrolledToTopRef.current;
        if (scrollTop <= 0 && deltaY > 0 && innerReachedTop) {
          pullStartedRef.current = true;
          startYRef.current = touch.clientY;
          pullOffsetRef.current = 0;
        } else {
          return;
        }
      }

      const pullDelta = touch.clientY - startYRef.current;
      const maxOffset = headerHeight * threshold;
      const offset = Math.max(0, Math.min(pullDelta / RESISTANCE, maxOffset));
      pullOffsetRef.current = offset;
      setContentTransform(contentRef, offset, false);
    }

    function handleTouchEnd() {
      'main thread';
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      if (!pullStartedRef.current) {
        hasScrolledToTopRef.current = false;
        return;
      }

      if (pullOffsetRef.current >= thresholdPx) {
        isRefreshingRef.current = true;
        pullOffsetRef.current = headerHeight;
        setContentTransform(contentRef, headerHeight, true);
        runOnBackground(onRefresh ?? (() => {}))();
      } else {
        pullStartedRef.current = false;
        setContentTransform(contentRef, 0, true);
      }
      hasScrolledToTopRef.current = false;
    }

    const defaultHeader = (
      <text className="lu-refresh__header-text">正在刷新...</text>
    );

    const rootStyle: CSSProperties = {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    };

    const headerStyle: CSSProperties = {
      position: 'absolute',
      top: `${-headerHeight}px`,
      left: 0,
      right: 0,
      height: `${headerHeight}px`,
    };

    return (
      <view
        className={cn('lu-refresh', 'lu-refresh--simulated', className)}
        style={rootStyle}
        main-thread:bindtouchstart={handleTouchStart}
        main-thread:bindtouchmove={handleTouchMove}
        main-thread:bindtouchend={handleTouchEnd}
      >
        <view className="lu-refresh__header" style={headerStyle}>
          {header ?? defaultHeader}
        </view>
        <view
          className="lu-refresh__content"
          style={{ flex: 1, width: '100%' }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          main-thread:ref={contentRef as any}
        >
          {children}
        </view>
      </view>
    );
  },
);

/**
 * Test-only exports. Mirrors the `isRefreshSupported` / `getFeatureMatrixForTesting`
 * exports from `platform.ts` — the testing harness can drive the descendant
 * resolution logic deterministically without dispatching main-thread touch
 * events.
 *
 * Named `simulatedRefreshInternals` to avoid shadowing `@lynx-js/react`'s
 * reserved `__test__` symbol.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const simulatedRefreshInternals = {
  findScrollable,
  readScrollTopOf,
  isScrollableTag,
};
