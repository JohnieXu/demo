import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { FieldRule } from '../Field/types'

export interface FormProps {
  /** 初始值 */
  initialValues?: Record<string, string | number | undefined>
  children?: ReactNode
  className?: string
  style?: CSSProperties
  /** 提交成功回调 */
  onFinish?: (values: Record<string, string | number | undefined>) => void
  /** 提交失败（校验不通过）回调 */
  onFinishFailed?: (
    errors: Record<string, string | undefined>,
    values: Record<string, string | number | undefined>,
  ) => void
  /** 任意字段值变化回调 */
  onValuesChange?: (
    changedValues: Record<string, string | number | undefined>,
    allValues: Record<string, string | number | undefined>,
  ) => void
}

export interface FormInstance {
  submit: () => void
  reset: () => void
  validate: () => Promise<boolean>
  getFieldsValue: () => Record<string, string | number | undefined>
  setFieldsValue: (values: Record<string, string | number | undefined>) => void
  getFieldError: (name: string) => string | undefined
  setFieldError: (name: string, error: string | undefined) => void
}

export type { FieldRule }
