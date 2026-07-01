import { useState } from '@lynx-js/react'
import { Button, Calendar } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

function formatDate(d?: Date | null): string {
  if (!d) return '-'
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

function formatResult(value: Date | Date[]): string {
  if (Array.isArray(value)) {
    return value.length ? value.map(formatDate).join(', ') : '-'
  }
  return formatDate(value)
}

export function CalendarDemo() {
  const [single, setSingle] = useState('-')
  const [range, setRange] = useState('-')
  const [multiple, setMultiple] = useState('-')
  const [popupShow, setPopupShow] = useState(false)
  const [popupResult, setPopupResult] = useState('-')

  return (
    <view>
      <DemoBlock title="平铺 · 单选 single">
        <text className="demo-result">选中: {single}</text>
        <view className="calendar-host">
          <Calendar
            poppable={false}
            type="single"
            showConfirm={false}
            onSelect={(v) => setSingle(formatResult(v))}
          />
        </view>
      </DemoBlock>

      <DemoBlock title="平铺 · 日期区间 range">
        <text className="demo-result">选中: {range}</text>
        <view className="calendar-host">
          <Calendar
            poppable={false}
            type="range"
            showConfirm={false}
            onConfirm={(v) => setRange(formatResult(v))}
          />
        </view>
      </DemoBlock>

      <DemoBlock title="按月切换 switchMode=month">
        <view className="calendar-host">
          <Calendar poppable={false} switchMode="month" showConfirm={false} />
        </view>
      </DemoBlock>

      <DemoBlock title="按年月切换 switchMode=year-month">
        <view className="calendar-host">
          <Calendar
            poppable={false}
            switchMode="year-month"
            showConfirm={false}
          />
        </view>
      </DemoBlock>

      <DemoBlock title="自定义主色 color">
        <view className="calendar-host">
          <Calendar
            poppable={false}
            type="range"
            color="#07c160"
            showConfirm={false}
          />
        </view>
      </DemoBlock>

      <DemoBlock title="多选 multiple">
        <text className="demo-result">选中: {multiple}</text>
        <view className="calendar-host">
          <Calendar
            poppable={false}
            type="multiple"
            showConfirm={false}
            onSelect={(v) => setMultiple(formatResult(v))}
          />
        </view>
      </DemoBlock>

      <DemoBlock title="弹窗 · 快捷选择">
        <text className="demo-result">结果: {popupResult}</text>
        <Button label="打开日历" onClick={() => setPopupShow(true)} />
        <Calendar
          show={popupShow}
          poppable
          type="single"
          title="选择日期"
          showConfirm={false}
          onShowChange={setPopupShow}
          onConfirm={(v) => {
            setPopupResult(formatResult(v))
            setPopupShow(false)
          }}
        />
      </DemoBlock>
    </view>
  )
}
