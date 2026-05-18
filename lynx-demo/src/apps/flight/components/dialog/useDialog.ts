import { useContext } from "@lynx-js/react"
import { DialogContext, type DialogContextValue } from "./DialogContext"

export function useDialog(): DialogContextValue {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error("useDialog must be used within DialogProvider")
  }
  return context
}