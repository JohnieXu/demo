import { createContext } from '@lynx-js/react'

export interface RadioGroupContextValue {
  value: string | number | undefined
  disabled: boolean
  checkedColor?: string
  setValue: (value: string | number) => void
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)
