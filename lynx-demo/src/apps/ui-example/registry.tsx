import { ButtonDemo } from './views/demos/ButtonDemo'
import { IconDemo } from './views/demos/IconDemo'
import { CalendarDemo } from './views/demos/CalendarDemo'

export interface DemoEntry {
  /** Route segment and unique key, e.g. 'calendar' → /component/calendar */
  key: string
  /** Display title, e.g. 'Calendar 日历' */
  title: string
  /** One-line description shown on the home list. */
  subtitle: string
  /** Group heading on the home list. */
  category: string
  /** The demo view for this component. */
  Component: () => JSX.Element
}

/**
 * Single source of truth for the example app. Both the home list and the
 * router derive from this array — to add a component, drop a `XxxDemo.tsx`
 * under `views/demos/` and append one entry here.
 */
export const DEMOS: DemoEntry[] = [
  {
    key: 'button',
    title: 'Button 按钮',
    subtitle: '变体 / 尺寸 / 禁用 / 点击事件',
    category: '基础组件',
    Component: ButtonDemo,
  },
  {
    key: 'icon',
    title: 'Icon 图标',
    subtitle: '跨端 SVG 图标,尺寸与颜色',
    category: '基础组件',
    Component: IconDemo,
  },
  {
    key: 'calendar',
    title: 'Calendar 日历',
    subtitle: '单选 / 区间 / 多选,支持 switchMode',
    category: '展示组件',
    Component: CalendarDemo,
  },
]
