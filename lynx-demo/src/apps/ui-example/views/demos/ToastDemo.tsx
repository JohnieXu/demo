import { useState } from '@lynx-js/react'
import { Button, Toast } from 'lynx-ui'
import {
  allowMultipleToast,
  closeToast,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
  showToast,
} from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function ToastDemo() {
  const [declarativeShow, setDeclarativeShow] = useState(false)

  const showText = () => showToast('轻提示')
  const showLongText = () => showToast('这是一段比较长的提示文字，用于测试最大宽度')
  const showTop = () => showToast({ message: '顶部提示', position: 'top' })
  const showBottom = () => showToast({ message: '底部提示', position: 'bottom' })
  const showSuccess = () => showSuccessToast('成功文案')
  const showFail = () => showFailToast('失败文案')
  const showLoading = () => {
    showLoadingToast({ message: '加载中...', duration: 0 })
    setTimeout(() => closeToast(), 2000)
  }
  const showClickable = () => showToast({ message: '点击关闭', closeOnClick: true })
  const showWithOverlay = () =>
    showToast({ message: '有遮罩', overlay: true, closeOnClickOverlay: true })
  const showForbidClick = () => showToast({ message: '禁止点击背景', forbidClick: true })
  const showMultiple = () => {
    allowMultipleToast(true)
    showToast({ message: '第一条', duration: 3000 })
    setTimeout(() => showToast({ message: '第二条', duration: 3000 }), 300)
    setTimeout(() => {
      closeToast(true)
      allowMultipleToast(false)
    }, 3500)
  }

  return (
    <view>
      <DemoBlock title="基础用法">
        <view className="demo-row">
          <Button label="文字提示" onClick={showText} />
          <Button label="长文字" onClick={showLongText} />
        </view>
      </DemoBlock>

      <DemoBlock title="位置">
        <view className="demo-row">
          <Button label="顶部" onClick={showTop} />
          <Button label="中间" onClick={showText} />
          <Button label="底部" onClick={showBottom} />
        </view>
      </DemoBlock>

      <DemoBlock title="状态">
        <view className="demo-row">
          <Button label="成功" onClick={showSuccess} />
          <Button label="失败" onClick={showFail} />
          <Button label="加载" onClick={showLoading} />
        </view>
      </DemoBlock>

      <DemoBlock title="交互">
        <view className="demo-row">
          <Button label="点击关闭" onClick={showClickable} />
          <Button label="遮罩可关" onClick={showWithOverlay} />
          <Button label="禁止背景点击" onClick={showForbidClick} />
        </view>
      </DemoBlock>

      <DemoBlock title="多实例">
        <view className="demo-row">
          <Button label="显示多个" onClick={showMultiple} />
        </view>
      </DemoBlock>

      <DemoBlock title="声明式用法">
        <view className="demo-row">
          <Button label="显示声明式 Toast" onClick={() => setDeclarativeShow(true)} />
        </view>
        <Toast
          show={declarativeShow}
          message="声明式 Toast"
          duration={2000}
          onClose={() => setDeclarativeShow(false)}
        />
      </DemoBlock>
    </view>
  )
}
