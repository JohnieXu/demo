import { createContext } from '@lynx-js/react'

export interface StepsContextValue {
  active: number
  activeColor?: string
  inactiveColor?: string
  clickable: boolean
  onClickStep: (index: number) => void
}

export const StepsContext = createContext<StepsContextValue | null>(null)

export const StepIndexContext = createContext<number>(0)
