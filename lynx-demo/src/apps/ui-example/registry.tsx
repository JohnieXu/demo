import { ButtonDemo } from './views/demos/ButtonDemo'
import { IconDemo } from './views/demos/IconDemo'
import { CalendarDemo } from './views/demos/CalendarDemo'
import { PopupDemo } from './views/demos/PopupDemo'
import { ToastDemo } from './views/demos/ToastDemo'
import { SpaceDemo } from './views/demos/SpaceDemo'
import { DividerDemo } from './views/demos/DividerDemo'
import { TagDemo } from './views/demos/TagDemo'
import { BadgeDemo } from './views/demos/BadgeDemo'
import { CellDemo } from './views/demos/CellDemo'
import { EmptyDemo } from './views/demos/EmptyDemo'
import { LoadingDemo } from './views/demos/LoadingDemo'
import { SubmitBarDemo } from './views/demos/SubmitBarDemo'
import { ContactCardDemo } from './views/demos/ContactCardDemo'
import { CouponCellDemo } from './views/demos/CouponCellDemo'
import { ActionBarDemo } from './views/demos/ActionBarDemo'
import { FieldDemo } from './views/demos/FieldDemo'
import { SearchDemo } from './views/demos/SearchDemo'
import { FormDemo } from './views/demos/FormDemo'
import { RateDemo } from './views/demos/RateDemo'
import { StepperDemo } from './views/demos/StepperDemo'
import { SliderDemo } from './views/demos/SliderDemo'
import { DialogDemo } from './views/demos/DialogDemo'
import { ActionSheetDemo } from './views/demos/ActionSheetDemo'
import { NotifyDemo } from './views/demos/NotifyDemo'
import { TabsDemo } from './views/demos/TabsDemo'
import { ActionBarIconDemo } from './views/demos/ActionBarIconDemo'

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
    key: 'popup',
    title: 'Popup 弹出层',
    subtitle: '居中 / 底部 / 顶部 / 左右抽屉 / 遮罩控制',
    category: '基础组件',
    Component: PopupDemo,
  },
  {
    key: 'toast',
    title: 'Toast 轻提示',
    subtitle: '文字 / 加载 / 成功 / 失败 / 位置 / 遮罩',
    category: '基础组件',
    Component: ToastDemo,
  },
  {
    key: 'space',
    title: 'Space 间距',
    subtitle: '水平 / 垂直 / 自定义间距 / 换行',
    category: '基础组件',
    Component: SpaceDemo,
  },
  {
    key: 'divider',
    title: 'Divider 分割线',
    subtitle: '水平 / 垂直 / 文字 / 虚线',
    category: '基础组件',
    Component: DividerDemo,
  },
  {
    key: 'cell',
    title: 'Cell 单元格',
    subtitle: '标题 / 值 / 标签 / 链接 / 分组',
    category: '基础组件',
    Component: CellDemo,
  },
  {
    key: 'tag',
    title: 'Tag 标签',
    subtitle: '类型 / 空心 / 圆角 / 尺寸 / 可关闭',
    category: '基础组件',
    Component: TagDemo,
  },
  {
    key: 'badge',
    title: 'Badge 徽标',
    subtitle: '数字 / 红点 / 位置 / 颜色',
    category: '基础组件',
    Component: BadgeDemo,
  },
  {
    key: 'loading',
    title: 'Loading 加载',
    subtitle: '圆形 /  spinner / 文案 / 颜色',
    category: '反馈组件',
    Component: LoadingDemo,
  },
  {
    key: 'empty',
    title: 'Empty 空状态',
    subtitle: '默认 / 错误 / 搜索 / 网络 / 自定义',
    category: '展示组件',
    Component: EmptyDemo,
  },
  {
    key: 'calendar',
    title: 'Calendar 日历',
    subtitle: '单选 / 区间 / 多选,支持 switchMode',
    category: '展示组件',
    Component: CalendarDemo,
  },
  {
    key: 'submit-bar',
    title: 'SubmitBar 提交栏',
    subtitle: '价格合计 / 提交按钮 / 提示 / 占位',
    category: '导航组件',
    Component: SubmitBarDemo,
  },
  {
    key: 'action-bar',
    title: 'ActionBar 动作栏',
    subtitle: '底部操作栏 / 图标按钮 / 加载禁用 / 占位',
    category: '导航组件',
    Component: ActionBarDemo,
  },
  {
    key: 'contact-card',
    title: 'ContactCard 联系人卡片',
    subtitle: '添加 / 编辑联系人 / 点击事件',
    category: '展示组件',
    Component: ContactCardDemo,
  },
  {
    key: 'coupon-cell',
    title: 'CouponCell 优惠券单元格',
    subtitle: '优惠券选择 / 单选 / 多选 / 自定义币种',
    category: '展示组件',
    Component: CouponCellDemo,
  },
  {
    key: 'field',
    title: 'Field 输入框',
    subtitle: '标签 / 清除 / 格式化 / 错误提示 / 字数统计',
    category: '表单组件',
    Component: FieldDemo,
  },
  {
    key: 'search',
    title: 'Search 搜索',
    subtitle: '搜索栏 / 圆角 / 取消按钮 / 受控',
    category: '表单组件',
    Component: SearchDemo,
  },
  {
    key: 'form',
    title: 'Form 表单',
    subtitle: '校验 / 提交 / 重置 / useForm',
    category: '表单组件',
    Component: FormDemo,
  },
  {
    key: 'rate',
    title: 'Rate 评分',
    subtitle: '半星 / 自定义数量与颜色 / 只读禁用',
    category: '表单组件',
    Component: RateDemo,
  },
  {
    key: 'stepper',
    title: 'Stepper 步进器',
    subtitle: '范围限制 / 步长 / 小数 / 圆角',
    category: '表单组件',
    Component: StepperDemo,
  },
  {
    key: 'slider',
    title: 'Slider 滑块',
    subtitle: '范围 / 步长 / 自定义颜色 / 拖动事件',
    category: '表单组件',
    Component: SliderDemo,
  },
  {
    key: 'dialog',
    title: 'Dialog 弹窗',
    subtitle: '确认 / 取消 / 圆角按钮 / 自定义内容',
    category: '反馈组件',
    Component: DialogDemo,
  },
  {
    key: 'action-sheet',
    title: 'ActionSheet 动作面板',
    subtitle: '选项 / 标题 / 描述 / 加载禁用',
    category: '反馈组件',
    Component: ActionSheetDemo,
  },
  {
    key: 'notify',
    title: 'Notify 消息通知',
    subtitle: '类型 / 位置 / 自定义颜色 / 自动关闭',
    category: '反馈组件',
    Component: NotifyDemo,
  },
  {
    key: 'tabs',
    title: 'Tabs 标签页',
    subtitle: '线型 / 卡片 / 禁用 / 切换事件',
    category: '导航组件',
    Component: TabsDemo,
  },
  {
    key: 'action-bar-icon',
    title: 'ActionBarIcon 动作栏图标',
    subtitle: '图标 / 文字 / 徽标 / 红点',
    category: '导航组件',
    Component: ActionBarIconDemo,
  },
]
