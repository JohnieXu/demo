// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License, Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from '@lynx-js/react'
import type { NodesRef } from '@lynx-js/types'
import { cn } from '../theme/cn'
import type { RefreshProps, RefreshRef } from './types'

const DEFAULT_HEADER_HEIGHT = 50

export const NativeRefresh = forwardRef<RefreshRef, RefreshProps>(
  function NativeRefresh(props, ref) {
    const {
      children,
      header,
      headerHeight = DEFAULT_HEADER_HEIGHT,
      onRefresh,
      refreshing,
      enabled = true,
      className,
      style,
    } = props

    const refreshRef = useRef<NodesRef>(null)
    const prevRefreshingRef = useRef(refreshing)

    useImperativeHandle(ref, () => ({
      finishRefresh() {
        refreshRef.current
          ?.invoke({ method: 'finishRefresh' })
          .exec()
      },
      startRefresh() {
        refreshRef.current
          ?.invoke({ method: 'autoStartRefresh' })
          .exec()
      },
    }))

    useEffect(() => {
      if (prevRefreshingRef.current && !refreshing) {
        refreshRef.current
          ?.invoke({ method: 'finishRefresh' })
          .exec()
      }
      prevRefreshingRef.current = refreshing
    }, [refreshing])

    const defaultHeader = (
      <text className="lu-refresh__header-text">正在刷新...</text>
    )

    return (
      <refresh
        ref={refreshRef}
        className={cn('lu-refresh', 'lu-refresh--native', className)}
        style={style}
        bindstartrefresh={onRefresh}
        enable-refresh={enabled}
      >
        <refresh-header
          className="lu-refresh__header"
          style={{ height: `${headerHeight}px` }}
        >
          {header ?? defaultHeader}
        </refresh-header>
        <view className="lu-refresh__content">{children}</view>
      </refresh>
    )
  },
)
