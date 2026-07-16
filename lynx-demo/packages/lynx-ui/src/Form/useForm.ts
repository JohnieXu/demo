import { useRef } from '@lynx-js/react'
import type { FormInstance } from './types'

export function useForm(): FormInstance {
  const apiRef = useRef<FormInstance>({
    submit: () => {},
    reset: () => {},
    validate: () => Promise.resolve(false),
    getFieldsValue: () => ({}),
    setFieldsValue: () => {},
    getFieldError: () => undefined,
    setFieldError: () => {},
  })
  return apiRef.current
}
