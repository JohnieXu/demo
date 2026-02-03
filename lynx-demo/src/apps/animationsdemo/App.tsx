import './app.scss'
import { useState, useEffect, useMainThreadRef, runOnMainThread } from '@lynx-js/react'
import type { Element } from '@lynx-js/types/main-thread'
import { useEnterFade, usePressScale, createEnterFadeMTS } from '../../animations/index'

function PressScaleDemo() {
  const { style, pressIn, pressOut, mts } = usePressScale({ pressedScale: 0.96 })
  return (
    <view className="section">
      <text className="title">PressScale 背景线程</text>
      <view className="box" style={style as any} bindtouchstart={pressIn} bindtouchend={pressOut}>
        <text className="label">press me</text>
      </view>
      <text className="title">PressScale 主线程（MTS）</text>
      <view className="box" main-thread:bindtouchstart={mts.onTouchStart} main-thread:bindtouchend={mts.onTouchEnd}>
        <text className="label">'main thread' press</text>
      </view>
    </view>
  )
}

function EnterFadeDemo() {
  const [visible, setVisible] = useState(true)
  const [style] = useEnterFade({ visible })
  const { handler, applyFromToTarget } = createEnterFadeMTS({
    from: { opacity: 1, y: 0, scale: 1 },
    to: { opacity: 0, y: 12, scale: 0.98 },
  })
  const boxRef = useMainThreadRef<Element>(null)
  const [mtsVisible, setMtsVisible] = useState(true)
  useEffect(() => {
    if (!mtsVisible) return
    runOnMainThread(() => {
      if (boxRef.current) {
        applyFromToTarget(boxRef.current)
      }
    })()
  }, [mtsVisible, boxRef, applyFromToTarget])
  return (
    <view className="section">
      <text className="title">EnterFade 背景线程</text>
      <view className="row">
        <view className="btn" bindtap={() => setVisible(!visible)}>
          <text>{visible ? 'Hide' : 'Show'}</text>
        </view>
      </view>
      {visible && (
        <view className="box" style={style as any}>
          <text className="label">enter-fade</text>
        </view>
      )}
      <text className="title">EnterFade 主线程（MTS）</text>
      <view className="row">
        <view className="btn" bindtap={() => setMtsVisible(!mtsVisible)}>
          <text>{mtsVisible ? 'Hide' : 'Show'}</text>
        </view>
      </view>
      {mtsVisible && (
        <view className="box" main-thread:ref={boxRef} main-thread:bindtap={handler}>
          <text className="label">tap to animate (MTS)</text>
        </view>
      )}
    </view>
  )
}

export function App() {
  return (
    <scroll-view className="container">
      <PressScaleDemo />
      <EnterFadeDemo />
    </scroll-view>
  )
}
