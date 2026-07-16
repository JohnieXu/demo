import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export type FieldType = 'text' | 'number' | 'tel' | 'password' | 'digit'

export type FieldTextAlign = 'left' | 'center' | 'right'

export type FieldRule = {
  required?: boolean
  message?: string
  pattern?: RegExp
  validator?: (
    value: string | number,
    rule: FieldRule,
  ) => boolean | string | Promise<boolean | string>
}

export interface FieldProps {
  /** 标签文本 */
  label?: string
  /** 字段名，在 Form 内使用 */
  name?: string
  /** 当前值（受控） */
  value?: string | number
  /** 默认值（非受控） */
  defaultValue?: string | number
  /** 输入框类型 */
  type?: FieldType
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否必填 */
  required?: boolean
  /** 是否显示清除图标 */
  clearable?: boolean
  /** 自定义清除图标 */
  clearIcon?: ReactNode
  /** 左侧图标 */
  leftIcon?: ReactNode
  /** 右侧图标 */
  rightIcon?: ReactNode
  /** 是否显示错误 */
  error?: boolean
  /** 错误提示文本 */
  errorMessage?: string
  /** 格式化函数 */
  formatter?: (val: string) => string
  /** 触发格式化的时机 */
  formatTrigger?: 'onChange' | 'onBlur'
  /** 最大输入长度 */
  maxlength?: number
  /** 是否显示字数统计 */
  showWordLimit?: boolean
  /** 标签后是否加冒号 */
  colon?: boolean
  /** 输入框对齐方式 */
  inputAlign?: FieldTextAlign
  /** 标签宽度 */
  labelWidth?: Numeric
  /** 标签对齐方式 */
  labelAlign?: FieldTextAlign
  /** 标签类名 */
  labelClass?: string
  /** 校验规则（在 Form 内也可配置） */
  rules?: FieldRule[]
  className?: string
  style?: CSSProperties
  onChange?: (val: string) => void
  onFocus?: () => void
  onBlur?: () => void
  onClear?: () => void
  onClickInput?: () => void
  onClickLeftIcon?: () => void
  onClickRightIcon?: () => void
  onConfirm?: (val: string) => void
}
