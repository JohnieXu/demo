import { useCallback, useEffect, useRef, useState } from "@lynx-js/react";
import type { BaseEvent, InputInputEvent, InputProps, NodesRef, SelectorQuery, uiMethodOptions } from "@lynx-js/types";
import "./FocusableInput.scss"

export interface FocusableInputProps extends InputProps {
  value: string
  autofocus?: boolean
  onChange?: (value: string) => void
}

export function FocusableInput(props: FocusableInputProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [innerValue, setInnerValue] = useState<string>(props.value);
  const inputRef = useRef<NodesRef>(null);
  const { onChange, bindinput } = props;
  const handleInput = useCallback((e: BaseEvent<'bindinput', InputInputEvent>) => {
    setInnerValue(e.detail.value);
    onChange?.(e.detail.value);
    bindinput?.(e);
  }, [onChange, bindinput]);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const invokeMethod = useCallback((uid: number, invokeParams: uiMethodOptions) => {
    return (lynx.createSelectorQuery() as {
      selectUniqId: (uid: number) => NodesRef
    } & SelectorQuery).selectUniqId(uid).invoke(invokeParams).exec()
  }, [])
  useEffect(() => {
    setInnerValue(props.value);
    inputRef.current?.invoke({
      method: 'setValue',
      params: {
        value: props.value
      }
    })
    // invokeMethod(inputRef.current?.id, {
    //   method: 'setValue',
    //   params: {
    //     value: props.value,
    //   }
    // })
  }, [props.value]);

  useEffect(() => {
    if (props.autofocus) {
      setTimeout(() => {
        inputRef.current?.invoke({
          method: 'focus',
        })
      }, 0)
    } else {
      setTimeout(() => {
        inputRef.current?.invoke({
          method: 'blur',
        })
      }, 0)
    }
  }, [props.autofocus]);

  return (
    <input ref={inputRef} className="focusable-input" {...props} bindinput={handleInput}>
    </input>
  );
}
