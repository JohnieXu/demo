import { useState, useCallback, type ReactNode } from "@lynx-js/react"
import { DialogContext } from "./DialogContext"
import { Dialog } from "./Dialog"

interface DialogProviderProps {
  children: ReactNode
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [isShow, setIsShow] = useState(false)
  const [dialogContent, setDialogContent] = useState("")

  const showDialog = useCallback((content: string) => {
    setDialogContent(content)
    setIsShow(true)
  }, [])

  const closeDialog = useCallback(() => {
    setIsShow(false)
    setDialogContent("")
  }, [])

  return (
    <DialogContext.Provider value={{ showDialog, closeDialog }}>
      <Dialog show={isShow} content={dialogContent} onShowChange={setIsShow} />
      {children}
    </DialogContext.Provider>
  )
}