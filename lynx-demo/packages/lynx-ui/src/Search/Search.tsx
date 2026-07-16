import { useEffect, useRef, useState } from '@lynx-js/react'
import type {
  CSSProperties,
  InputConfirmEvent,
  InputInputEvent,
  InputProps,
  NodesRef,
} from '@lynx-js/types'
import { Icon } from '../Icon'
import { cn } from '../theme/cn'
import { createNamespace, isDef } from '../utils'
import type { SearchProps } from './types'

const bem = createNamespace('search')

const SEARCH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
  <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.1zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
</svg>`

const CLEAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
  <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
</svg>`

interface SearchInputProps extends InputProps {
  value?: string
}

export function Search(props: SearchProps) {
  const {
    defaultValue = '',
    value: valueProp,
    placeholder = '',
    inputAlign = 'left',
    disabled = false,
    readonly = false,
    clearable = true,
    background,
    shape = 'square',
    leftIcon,
    rightIcon,
    actionText,
    showAction = false,
    className,
    style,
    onSearch,
    onChange,
    onFocus,
    onBlur,
    onClear,
    onCancel,
    onClickInput,
  } = props

  const inputRef = useRef<NodesRef>(null)
  const isControlled = isDef(valueProp)
  const [internalValue, setInternalValue] = useState(String(defaultValue ?? ''))

  const value = isControlled ? String(valueProp ?? '') : internalValue

  useEffect(() => {
    if (isControlled) {
      inputRef.current?.invoke({
        method: 'setValue',
        params: { value },
      })
    }
  }, [isControlled, value])

  const updateValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }
    onChange?.(nextValue)
  }

  const handleInput = (e: { detail: InputInputEvent }) => {
    updateValue(e.detail.value)
  }

  const handleConfirm = (e: { detail: InputConfirmEvent }) => {
    onSearch?.(e.detail.value)
  }

  const handleFocus = () => {
    onFocus?.()
  }

  const handleBlur = () => {
    onBlur?.()
  }

  const handleClear = () => {
    updateValue('')
    onClear?.()
  }

  const handleActionTap = () => {
    onCancel?.()
  }

  const handleClickInput = () => {
    onClickInput?.()
  }

  const hasValue = value.length > 0

  const rootStyle: CSSProperties = { ...style }
  if (isDef(background)) {
    rootStyle.background = background
  }

  const inputProps: SearchInputProps = {
    ref: inputRef,
    className: cn(bem('input', { [inputAlign]: true })),
    type: 'text',
    value,
    placeholder,
    disabled,
    readonly,
    'confirm-type': 'search',
    bindinput: handleInput,
    bindconfirm: handleConfirm,
    bindfocus: handleFocus,
    bindblur: handleBlur,
  }

  return (
    <view
      className={cn(bem({ [shape]: true }), className)}
      style={rootStyle}
    >
      <view className={bem('content')}>
        <view className={bem('left-icon')}>
          {leftIcon ?? <Icon svg={SEARCH_SVG} className={bem('search-icon')} />}
        </view>
        <view className={bem('input-wrap')} bindtap={handleClickInput}>
          <input {...(inputProps as InputProps)} />
        </view>
        {clearable && hasValue && !readonly && !disabled && (
          <view className={bem('clear')} bindtap={handleClear}>
            <Icon svg={CLEAR_SVG} className={bem('clear-icon')} />
          </view>
        )}
        {rightIcon && <view className={bem('right-icon')}>{rightIcon}</view>}
      </view>
      {showAction && (
        <view className={bem('action')} bindtap={handleActionTap}>
          <text className={bem('action-text')}>{actionText ?? '取消'}</text>
        </view>
      )}
    </view>
  )
}

export type { SearchProps } from './types'
