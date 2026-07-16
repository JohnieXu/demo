import { Button } from 'lynx-ui'
import { closeNotify, showNotify } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function NotifyDemo() {
  const showPrimary = () => showNotify({ type: 'primary', message: '主要通知' })
  const showSuccess = () => showNotify({ type: 'success', message: '成功通知' })
  const showWarning = () => showNotify({ type: 'warning', message: '警告通知' })
  const showDanger = () => showNotify('危险通知')
  const showTop = () =>
    showNotify({ type: 'primary', message: '顶部通知', position: 'top' })
  const showBottom = () =>
    showNotify({ type: 'primary', message: '底部通知', position: 'bottom' })
  const showCustom = () =>
    showNotify({ message: '自定义颜色', color: '#fff', background: '#7232dd' })

  return (
    <view>
      <DemoBlock title="基础用法">
        <view className="demo-row">
          <Button label="文字通知" onClick={showDanger} />
          <Button label="主要通知" onClick={showPrimary} />
        </view>
      </DemoBlock>

      <DemoBlock title="状态">
        <view className="demo-row">
          <Button label="成功" onClick={showSuccess} />
          <Button label="警告" onClick={showWarning} />
        </view>
      </DemoBlock>

      <DemoBlock title="位置">
        <view className="demo-row">
          <Button label="顶部" onClick={showTop} />
          <Button label="底部" onClick={showBottom} />
        </view>
      </DemoBlock>

      <DemoBlock title="自定义">
        <view className="demo-row">
          <Button label="自定义颜色" onClick={showCustom} />
          <Button label="手动关闭" onClick={closeNotify} />
        </view>
      </DemoBlock>
    </view>
  )
}
