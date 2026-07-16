import { useState } from '@lynx-js/react'
import { Stepper, showToast } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function StepperDemo() {
  const [value, setValue] = useState(1)

  return (
    <view>
      <DemoBlock title="基础用法">
        <Stepper value={value} onChange={(v) => setValue(Number(v))} />
      </DemoBlock>

      <DemoBlock title="限制范围">
        <Stepper
          defaultValue={3}
          min={1}
          max={5}
          onOverlimit={(action) => showToast({ message: `${action} 越界`, duration: 1000 })}
        />
      </DemoBlock>

      <DemoBlock title="步长与小数">
        <Stepper
          defaultValue={1.5}
          step={0.5}
          decimalLength={1}
        />
      </DemoBlock>

      <DemoBlock title="禁用输入">
        <Stepper disableInput defaultValue={2} />
      </DemoBlock>

      <DemoBlock title="圆角风格">
        <Stepper theme="round" defaultValue={1} />
      </DemoBlock>

      <DemoBlock title="禁用">
        <Stepper disabled defaultValue={2} />
      </DemoBlock>
    </view>
  )
}
