/* eslint-disable @typescript-eslint/no-unused-expressions */
import { easings } from '@react-spring/web'
import { MainThreadRef, runOnBackground, runOnMainThread, useMainThreadRef, useRef } from '@lynx-js/react'
import { MainThread } from '@lynx-js/types'

// 动画值类型 需要支持: number | { [key: string]: number }
export type AnimationValue = number | Record<string, number>

class Animation<T extends AnimationValue> {
  requestId: number | null = null
  animate({ from, to, duration = 300, easing = 'linear', callback = () => {} }: {
    from: T,
    to: T,
    duration?: number,
    easing?: keyof typeof easings,
    callback?: (t: T) => void,
  }) {
    this.cancel()

    const start = Date.now()
    const f = (timestamp: number) => {
      const progress = (timestamp - start) / duration
      if (progress < 1) {
        if (typeof from === 'number' && typeof to === 'number') {
          const e = this.easing(easing, progress)
          if (typeof e === 'number') {
            callback((from + (to - from) * e) as T)
          } else {
            // e is EasingFunction
            // TODO: 处理 easing 为函数的情况
            callback((from + (to - from) * e(progress)) as T)
          }
        } else if (typeof from === 'object' && typeof to === 'object') {
          const result: Record<string, number> = {}
          for (const key in from as Record<string, number>) {
            const e = this.easing(easing, progress)
            if (typeof e === 'number') {
              result[key] = from[key] + (to[key] - from[key]) * e
            } else {
              // e is EasingFunction
              // TODO: 处理 easing 为函数的情况
              result[key] = from[key] + (to[key] - from[key]) * e(progress)
            }
          }
          callback(result as T)
        }
        requestAnimationFrame(f)
      } else {
        callback(to)
      }
    }

    this.requestId = requestAnimationFrame(f)
  }
  cancel() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId)
      this.requestId = null
    }
  }
  easing(e: keyof typeof easings, progress: number) {
    return easings[e] ? easings[e](progress) : this.linear(progress)
  }
  linear(progress: number) {
    return progress
  }
}

export function useStyle<T extends Record<string, number>>(mapStyle?: (val: number) => string) {
  const elementRef = useMainThreadRef<MainThread.Element | undefined>()

  function setStyle(val: T, target?: MainThreadRef<MainThread.Element | undefined>) {
    'main thread'
    const element = target?.current || elementRef.current
    if (element) {
      let transform = ''
      for (const key in val) {
        const value = val[key]
        if (key === 'x') {
          transform += `translateX(${value}px) `
        } else if (key === 'y') {
          transform += `translateY(${value}px) `
        } else if (key === 'opacity') {
          element.setStyleProperty('opacity', String(value))
        } else {
          element.setStyleProperty(key, mapStyle?.(value) || `${value}px`)
        }
      }
      if (transform) {
        element.setStyleProperty('transform', transform.trim())
      }
    }
  }

  return {
    elementRef,
    setStyle
  }
}


export function useAnimation<T extends AnimationValue>({
  duration = 300,
  easing = 'linear',
  callback = () => {},
}: {
  duration?: number,
  easing?: keyof typeof easings,
  callback?: (progress: T) => void,
}) {
  const animation = useRef(new Animation<T>())
  const animationMTS = useMainThreadRef(new Animation<T>())
  const { elementRef, setStyle } = useStyle()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function doAnimate({ from, to, duration, easing, callback }: { from: T, to: T, duration?: number, easing?: keyof typeof easings, callback?: (progress: T) => void }) {
    'background only'
    animation.current.cancel()
    animation.current.animate({ from, to, duration, easing, callback })
  }
  function animateMTS({ from, to }: { from: T, to: T }, target?: MainThreadRef<MainThread.Element | undefined>) {
    'main thread'
    // runOnBackground(doAnimate)({ from, to, duration, easing, callback: (t) => {
    //    typeof t === 'number' ? setStyle({ x: t }, target) : setStyle(t as Record<string, number>, target)
    //    callback?.(t)
    // } })
    animationMTS.current.animate({ from, to, duration, easing, callback: (t) => {
       typeof t === 'number' ? setStyle({ x: t }, target) : setStyle(t as Record<string, number>, target)
       callback?.(t)
    } })
  }
  function animate({ from, to }: { from: T, to: T }) {
    animation.current.cancel()
    animation.current.animate({ from, to, duration, easing, callback: (t) => {
       typeof t === 'number' ? runOnMainThread(setStyle)({ x: t }) : runOnMainThread(setStyle)(t)
       callback?.(t)
    } })
  }
  return {
    aniationRef: elementRef,
    animateMTS,
    animate
  }
}
