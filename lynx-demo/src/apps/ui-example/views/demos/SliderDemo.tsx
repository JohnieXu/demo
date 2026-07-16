import { useState } from '@lynx-js/react'
import { Slider, showToast } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function SliderDemo() {
  const [value, setValue] = useState(50)

  return (
    <view>
      <DemoBlock title="基础用法">
        <Slider value={value} onChange={setValue} />
      </DemoBlock>

      <DemoBlock title="自定义范围与步长">
        <Slider
          defaultValue={30}
          min={0}
          max={200}
          step={10}
        />
      </DemoBlock>

      <DemoBlock title="自定义颜色">
        <Slider
          defaultValue={40}
          activeColor="#ff5712"
          inactiveColor="#e7e7e7"
        />
      </DemoBlock>

      <DemoBlock title="禁用">
        <Slider disabled defaultValue={50} />
      </DemoBlock>

      <DemoBlock title="事件">
        <Slider
          defaultValue={20}
          onChange={(val) => showToast({ message: `当前值：${val}`, duration: 1000 })}
          onDragStart={(val) => showToast({ message: `开始拖动：${val}`, duration: 1000 })}
          onDragEnd={(val) => showToast({ message: `结束拖动：${val}`, duration: 1000 })}
        />
      </DemoBlock>
    </view>
  )
}
