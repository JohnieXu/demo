import { createContext } from '@lynx-js/react'

export interface CheckboxGroupContextValue {
  value: Array<string | number>
  disabled: boolean
  max?: number
  shape?: 'square' | 'round'
  checkedColor?: string
  toggle: (name: string | number) => void
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null)
