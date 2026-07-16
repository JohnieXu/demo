import { useEffect, useMemo, useRef, useState } from '@lynx-js/react'
import type { CSSProperties, InputProps, NodesRef } from '@lynx-js/types'
import { Icon } from '../Icon'
import { icons } from '../Icon/icons'
import { cn } from '../theme/cn'
import { addUnit, createNamespace, isDef } from '../utils'
import { useFormContext } from '../Form/context'
import type { FieldInstance } from '../Form/context'
import type { FieldProps } from './types'

const bem = createNamespace('field')

const CLEAR_SVG = icons.close

export function Field(props: FieldProps) {
  const {
    label,
    name,
    value: valueProp,
    defaultValue = '',
    type = 'text',
    placeholder,
    disabled = false,
    readonly = false,
    required = false,
    clearable = false,
    clearIcon = <Icon svg={CLEAR_SVG} className={bem('clear-icon')} />,
    leftIcon,
    rightIcon,
    error: errorProp,
    errorMessage: errorMessageProp,
    formatter,
    formatTrigger = 'onChange',
    maxlength,
    showWordLimit = false,
    colon = false,
    inputAlign = 'left',
    labelWidth,
    labelAlign = 'left',
    labelClass,
    rules,
    className,
    style,
    onChange,
    onFocus,
    onBlur,
    onClear,
    onClickInput,
    onClickLeftIcon,
    onClickRightIcon,
    onConfirm,
  } = props

  const formContext = useFormContext()
  const isInForm = Boolean(name && formContext)

  const formValue = isInForm && name ? formContext!.values[name] : undefined
  const formError = isInForm && name ? formContext!.errors[name] : undefined

  const isControlled = isDef(valueProp) || isInForm
  const [innerValue, setInnerValue] = useState(String(defaultValue ?? ''))

  const currentValue = isInForm
    ? String(formValue ?? '')
    : isDef(valueProp)
      ? String(valueProp)
      : innerValue

  const [focused, setFocused] = useState(false)
  const inputRef = useRef<NodesRef>(null)

  useEffect(() => {
    if (isDef(valueProp)) {
      setInnerValue(String(valueProp))
    }
  }, [valueProp])

  useEffect(() => {
    inputRef.current?.invoke({
      method: 'setValue',
      params: { value: currentValue },
    })
  }, [currentValue])

  useEffect(() => {
    if (!name || !formContext) return
    const field: FieldInstance = {
      name,
      defaultValue: defaultValue as string | number | undefined,
      rules,
      validate: async () => formContext.validateField(name),
      reset: () => {
        if (!isControlled) {
          setInnerValue(String(defaultValue ?? ''))
        }
      },
    }
    formContext.registerField(field)
    return () => {
      formContext.unregisterField(name)
    }
  }, [name, formContext, rules, defaultValue, isControlled])

  const applyFormat = (val: string) => {
    if (!formatter) return val
    return formatter(val)
  }

  const updateValue = (val: string, trigger?: 'input' | 'blur') => {
    let next = val
    if (formatter && formatTrigger === 'onChange' && trigger !== 'blur') {
      next = applyFormat(val)
    }
    if (!isControlled) {
      setInnerValue(next)
    }
    if (name && formContext) {
      formContext.setFieldValue(name, next)
    }
    onChange?.(next)
  }

  const handleInput = (e: { detail: { value: string } }) => {
    if (disabled || readonly) return
    updateValue(e.detail.value, 'input')
  }

  const handleFocus = () => {
    if (disabled) return
    setFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    if (disabled) return
    setFocused(false)
    let next = currentValue
    if (formatter && formatTrigger === 'onBlur') {
      next = applyFormat(currentValue)
      if (!isControlled) setInnerValue(next)
      if (name && formContext) formContext.setFieldValue(name, next)
      if (next !== currentValue) onChange?.(next)
    }
    if (name && formContext) {
      void formContext.validateField(name)
    }
    onBlur?.()
  }

  const handleClear = () => {
    if (disabled || readonly) return
    updateValue('')
    onClear?.()
  }

  const handleConfirm = (e: { detail: { value: string } }) => {
    onConfirm?.(e.detail.value)
  }

  const hasValue = currentValue.length > 0
  const showClear = clearable && hasValue && !disabled && !readonly && (focused || true)
  const error = errorProp ?? Boolean(formError)
  const errorMessage = errorMessageProp ?? formError

  const labelStyle: CSSProperties | undefined = useMemo(() => {
    if (!isDef(labelWidth)) return undefined
    return { width: addUnit(labelWidth) }
  }, [labelWidth])

  const wordLimit = maxlength && showWordLimit

  return (
    <>
      <view
        className={cn(
          bem({
            required,
            error,
            disabled,
            readonly,
            [`label-${labelAlign}`]: true,
          }),
          className,
        )}
        style={style}
      >
        {label && (
          <view
            className={cn(bem('label'), labelClass)}
            style={labelStyle}
          >
            <text className={bem('label-text')}>
              {label}
              {colon ? ':' : ''}
            </text>
          </view>
        )}
        {leftIcon && (
          <view className={bem('left-icon')} bindtap={onClickLeftIcon}>
            {leftIcon}
          </view>
        )}
        <view className={bem('body')} bindtap={onClickInput}>
          <input
            {...({
              ref: inputRef,
              className: cn(bem('control', { [inputAlign]: true })),
              type,
              value: currentValue,
              placeholder,
              disabled,
              readonly,
              maxlength,
              bindinput: handleInput,
              bindfocus: handleFocus,
              bindblur: handleBlur,
              bindconfirm: handleConfirm,
            } as InputProps)}
          />
          {showClear && (
            <view className={bem('clear')} bindtap={handleClear}>
              {clearIcon}
            </view>
          )}
          {rightIcon && (
            <view className={bem('right-icon')} bindtap={onClickRightIcon}>
              {rightIcon}
            </view>
          )}
          {wordLimit && (
            <view className={bem('word-limit')}>
              <text className={bem('word-num')}>{currentValue.length}</text>
              <text>/</text>
              <text>{maxlength}</text>
            </view>
          )}
        </view>
      </view>
      {errorMessage && (
        <view className={bem('error-message')}>
          <text>{errorMessage}</text>
        </view>
      )}
    </>
  )
}

export type { FieldProps, FieldType, FieldTextAlign, FieldRule } from './types'
