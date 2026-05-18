import { createContext, type Context } from "@lynx-js/react"

export interface DialogContextValue {
  showDialog: (content: string) => void
  closeDialog: () => void
}

const DialogContext: Context<DialogContextValue | null> = createContext<DialogContextValue | null>(null)

export { DialogContext }