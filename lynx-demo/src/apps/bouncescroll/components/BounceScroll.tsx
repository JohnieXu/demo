import { type ReactNode, useMainThreadRef, runOnBackground, runOnMainThread } from '@lynx-js/react'
import type { BaseTouchEvent, CSSProperties } from '@lynx-js/types'
import type { Element } from '@lynx-js/types/main-thread'
import clsx from 'clsx'

export type BounceScrollDirection = 'vertical' | 'horizontal' | 'both'

export interface BounceScrollProps {
  className?: string
  style?: CSSProperties
  children?: ReactNode
  direction?: BounceScrollDirection
  maxBounce?: number
  resistance?: number
}

export function BounceScroll(props: BounceScrollProps) {
  const {
    className,
    style,
    children,
    direction = 'vertical',
    maxBounce = 100,
    resistance = 3,
  } = props

  const scrollRef = useMainThreadRef<Element>()
  const startTouchX = useMainThreadRef(0)
  const startTouchY = useMainThreadRef(0)
  const isDragging = useMainThreadRef(false)
  const bounceOffsetX = useMainThreadRef(0)
  const bounceOffsetY = useMainThreadRef(0)
  const animationFrameId = useMainThreadRef<number | null>(null)

  function updateBounceStyle(x: number, y: number) {
    'main thread'
    if (!scrollRef.current) return

    const transform = []
    if (direction === 'horizontal' || direction === 'both') {
      transform.push(`translateX(${x}px)`)
    }
    if (direction === 'vertical' || direction === 'both') {
      transform.push(`translateY(${y}px)`)
    }
    if (transform.length > 0) {
      scrollRef.current.setStyleProperty('transform', transform.join(' '))
    }
  }

  function handleTouchStart(e: BaseTouchEvent<unknown>) {
    'main thread'
    if (!scrollRef.current) return

    const touch = e.touches[0]
    startTouchX.current = touch.clientX
    startTouchY.current = touch.clientY

    isDragging.current = true
    bounceOffsetX.current = 0
    bounceOffsetY.current = 0

    // 取消正在进行的回弹动画
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }

    // 重置 transform
    updateBounceStyle(0, 0)
  }

  function handleTouchMove(e: BaseTouchEvent<unknown>) {
    'main thread'
    if (!scrollRef.current || !isDragging.current) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - startTouchX.current
    const deltaY = touch.clientY - startTouchY.current

    // 使用类型断言访问滚动属性（Lynx Element 类型可能不包含这些属性，但运行时存在）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = scrollRef.current as any
    const scrollLeft = element.scrollLeft || 0
    const scrollTop = element.scrollTop || 0
    const scrollWidth = element.scrollWidth || 0
    const scrollHeight = element.scrollHeight || 0
    const clientWidth = element.clientWidth || 0
    const clientHeight = element.clientHeight || 0

    let newBounceX = 0
    let newBounceY = 0

    // 处理横向滚动
    if (direction === 'horizontal' || direction === 'both') {
      const isAtLeft = scrollLeft <= 0
      const isAtRight = scrollLeft + clientWidth >= scrollWidth

      if (isAtLeft && deltaX > 0) {
        // 在左边界，向右拖拽
        newBounceX = Math.min(deltaX / resistance, maxBounce)
      } else if (isAtRight && deltaX < 0) {
        // 在右边界，向左拖拽
        newBounceX = Math.max(deltaX / resistance, -maxBounce)
      }
    }

    // 处理垂直滚动
    if (direction === 'vertical' || direction === 'both') {
      const isAtTop = scrollTop <= 0
      const isAtBottom = scrollTop + clientHeight >= scrollHeight

      if (isAtTop && deltaY > 0) {
        // 在顶部边界，向下拖拽
        newBounceY = Math.min(deltaY / resistance, maxBounce)
      } else if (isAtBottom && deltaY < 0) {
        // 在底部边界，向上拖拽
        newBounceY = Math.max(deltaY / resistance, -maxBounce)
      }
    }

    bounceOffsetX.current = newBounceX
    bounceOffsetY.current = newBounceY

    // 直接更新弹性偏移样式
    updateBounceStyle(newBounceX, newBounceY)
  }

  function handleTouchEnd() {
    'main thread'
    if (!isDragging.current) return

    isDragging.current = false

    const startX = bounceOffsetX.current
    const startY = bounceOffsetY.current

    // 如果有弹性偏移，使用动画回弹到 0
    // if (startX !== 0 || startY !== 0) {
    //   const duration = 300 // 动画时长（毫秒）
    //   const startTime = Date.now()

    //   // 使用函数表达式而不是函数声明，避免在严格模式下的错误
    //   const animate = () => {
    //     'background only'
    //     const currentTime = Date.now()
    //     const elapsed = currentTime - startTime
    //     const progress = Math.min(elapsed / duration, 1)

    //     // 使用 easeOutCubic 缓动函数
    //     const easeOutCubic = 1 - Math.pow(1 - progress, 3)

    //     const currentX = startX * (1 - easeOutCubic)
    //     const currentY = startY * (1 - easeOutCubic)

    //     // 在主线程中更新样式
    //     runOnMainThread(updateBounceStyle)(currentX, currentY)

    //     if (progress < 1) {
    //       animationFrameId.current = requestAnimationFrame(animate) as unknown as number
    //     } else {
    //       runOnMainThread(updateBounceStyle)(0, 0)
    //       animationFrameId.current = null
    //     }
    //   }

    //   // 在背景线程中启动动画循环
    //   runOnBackground(() => {
    //     animationFrameId.current = requestAnimationFrame(animate) as unknown as number
    //   })()
    // } else {
    //   bounceOffsetX.current = 0
    //   bounceOffsetY.current = 0
    // }
    bounceOffsetX.current = 0
    bounceOffsetY.current = 0
  }

  return (
    <scroll-view
      className={clsx('bounce-scroll', className)}
      style={style}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      main-thread:ref={scrollRef as any}
      main-thread:bindtouchstart={handleTouchStart}
      main-thread:bindtouchmove={handleTouchMove}
      main-thread:bindtouchend={handleTouchEnd}
    >
      {children}
    </scroll-view>
  )
}
