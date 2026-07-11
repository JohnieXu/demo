import { useState } from '@lynx-js/react'
import { Button, Popup } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function PopupDemo() {
  const [centerShow, setCenterShow] = useState(false)
  const [bottomShow, setBottomShow] = useState(false)
  const [topShow, setTopShow] = useState(false)
  const [leftShow, setLeftShow] = useState(false)
  const [rightShow, setRightShow] = useState(false)
  const [noOverlayShow, setNoOverlayShow] = useState(false)

  return (
    <view>
      <DemoBlock title="居中弹出 center">
        <Button label="打开居中弹窗" onClick={() => setCenterShow(true)} />
        <Popup
          show={centerShow}
          onShowChange={setCenterShow}
          round
        >
          <view className="popup-demo-panel popup-demo-panel--center">
            <text className="popup-demo-title">居中弹窗</text>
            <text className="popup-demo-desc">点击遮罩关闭</text>
            <Button label="关闭" onClick={() => setCenterShow(false)} />
          </view>
        </Popup>
      </DemoBlock>

      <DemoBlock title="底部弹出 bottom">
        <Button label="打开底部弹窗" onClick={() => setBottomShow(true)} />
        <Popup
          show={bottomShow}
          position="bottom"
          onShowChange={setBottomShow}
          round
          safeAreaInsetBottom
        >
          <view className="popup-demo-panel popup-demo-panel--bottom">
            <text className="popup-demo-title">底部弹窗</text>
            <text className="popup-demo-desc">支持圆角和安全区</text>
            <Button label="关闭" onClick={() => setBottomShow(false)} />
          </view>
        </Popup>
      </DemoBlock>

      <DemoBlock title="顶部弹出 top">
        <Button label="打开顶部弹窗" onClick={() => setTopShow(true)} />
        <Popup
          show={topShow}
          position="top"
          onShowChange={setTopShow}
          round
        >
          <view className="popup-demo-panel popup-demo-panel--top">
            <text className="popup-demo-title">顶部弹窗</text>
            <Button label="关闭" onClick={() => setTopShow(false)} />
          </view>
        </Popup>
      </DemoBlock>

      <DemoBlock title="左侧弹出 left">
        <Button label="打开左侧抽屉" onClick={() => setLeftShow(true)} />
        <Popup
          show={leftShow}
          position="left"
          onShowChange={setLeftShow}
          round
        >
          <view className="popup-demo-panel popup-demo-panel--side">
            <text className="popup-demo-title">左侧抽屉</text>
            <Button label="关闭" onClick={() => setLeftShow(false)} />
          </view>
        </Popup>
      </DemoBlock>

      <DemoBlock title="右侧弹出 right">
        <Button label="打开右侧抽屉" onClick={() => setRightShow(true)} />
        <Popup
          show={rightShow}
          position="right"
          onShowChange={setRightShow}
          round
        >
          <view className="popup-demo-panel popup-demo-panel--side">
            <text className="popup-demo-title">右侧抽屉</text>
            <Button label="关闭" onClick={() => setRightShow(false)} />
          </view>
        </Popup>
      </DemoBlock>

      <DemoBlock title="无遮罩 no overlay">
        <Button label="打开无遮罩弹窗" onClick={() => setNoOverlayShow(true)} />
        <Popup
          show={noOverlayShow}
          overlay={false}
          onShowChange={setNoOverlayShow}
          round
        >
          <view className="popup-demo-panel popup-demo-panel--center">
            <text className="popup-demo-title">无遮罩弹窗</text>
            <Button label="关闭" onClick={() => setNoOverlayShow(false)} />
          </view>
        </Popup>
      </DemoBlock>
    </view>
  )
}
