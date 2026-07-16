import { useState } from '@lynx-js/react'
import { ActionSheet, Button, showToast } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

const ACTIONS = [
  { name: '选项一', color: '#ff5712' },
  { name: '选项二', subname: '补充描述信息' },
  { name: '选项三' },
]

export function ActionSheetDemo() {
  const [show, setShow] = useState(false)

  const handleSelect = (action: { name: string }) => {
    showToast({ message: `选择了 ${action.name}`, duration: 1500 })
  }

  const handleCancel = () => {
    showToast({ message: '取消选择', duration: 1500 })
  }

  return (
    <view>
      <DemoBlock title="基础用法">
        <Button label="显示动作面板" onClick={() => setShow(true)} />
        <ActionSheet
          show={show}
          title="标题"
          description="这是一段描述信息"
          actions={ACTIONS}
          cancelText="取消"
          onShowChange={setShow}
          onSelect={handleSelect}
          onCancel={handleCancel}
        />
      </DemoBlock>
    </view>
  )
}
