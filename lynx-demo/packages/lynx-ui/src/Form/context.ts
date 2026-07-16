import { createContext, useContext } from '@lynx-js/react'
import type { FieldRule } from '../Field/types'

export interface FieldInstance {
  name: string
  defaultValue?: string | number
  rules?: FieldRule[]
  validate: () => Promise<string | undefined>
  reset: () => void
}

export interface FormContextValue {
  values: Record<string, string | number | undefined>
  errors: Record<string, string | undefined>
  registerField: (field: FieldInstance) => void
  unregisterField: (name: string) => void
  setFieldValue: (name: string, value: string | number) => void
  validateField: (name: string) => Promise<string | undefined>
  validateAll: () => Promise<boolean>
  submit: () => void
}

export const FormContext = createContext<FormContextValue | undefined>(undefined)

export function useFormContext(): FormContextValue | undefined {
  return useContext(FormContext)
}
