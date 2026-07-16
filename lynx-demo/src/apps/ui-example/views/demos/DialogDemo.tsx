import { useState } from '@lynx-js/react'
import { Button, Dialog } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function DialogDemo() {
  const [defaultShow, setDefaultShow] = useState(false)
  const [roundShow, setRoundShow] = useState(false)

  return (
    <view>
      <DemoBlock title="基础用法">
        <Button label="打开默认弹窗" onClick={() => setDefaultShow(true)} />
        <Dialog
          show={defaultShow}
          title="标题"
          message="这是一个默认样式的 Dialog"
          showCancelButton
          onShowChange={setDefaultShow}
          onConfirm={() => console.log('confirm')}
          onCancel={() => console.log('cancel')}
        />
      </DemoBlock>

      <DemoBlock title="圆角按钮 round-button">
        <Button label="打开圆角按钮弹窗" onClick={() => setRoundShow(true)} />
        <Dialog
          show={roundShow}
          theme="round-button"
          title="提示"
          message="这是一个圆角按钮样式的 Dialog"
          showCancelButton
          onShowChange={setRoundShow}
        />
      </DemoBlock>
    </view>
  )
}
