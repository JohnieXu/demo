import { DialogBackdrop, DialogClose, DialogContent, DialogRoot, DialogTrigger, DialogView } from "@lynx-js/lynx-ui";
import { useCallback, useEffect, useState } from "@lynx-js/react";
import './Dialog.css'

export interface DialogProps {
  show: boolean;
  content: string;
  onShowChange: (show: boolean) => void;
}

export function Dialog(props: DialogProps) {
  const { show, content, onShowChange } = props
  const [isShow, setIsShow] = useState(show)
  const [dialogContent, setDialogContent] = useState(content)
  const onClose = useCallback(() => {
    setIsShow(false)
    onShowChange(false)
  }, [onShowChange])
  
  useEffect(() => {
    setDialogContent(content)
  }, [content])
  useEffect(() => {
    setIsShow(show)
  }, [show])
  return (
    <view className="lunaris-dark">
      <DialogRoot show={isShow} onShowChange={(v) => { setIsShow(v); onShowChange(v) }}>
        <DialogView className="dialog-viewport">
          <DialogTrigger className="dialog-trigger"><text>open</text></DialogTrigger>
          <DialogBackdrop />
          <DialogContent className="dialog-content">
            <view className="dialog-body">
              <text className="dialog-desc">{dialogContent}</text>
            </view>
            <DialogClose className="dialog-close">
              <text bindtap={onClose} className="dialog-close-text">ok</text>
            </DialogClose>
          </DialogContent>
        </DialogView>
      </DialogRoot>
    </view>
  )
}