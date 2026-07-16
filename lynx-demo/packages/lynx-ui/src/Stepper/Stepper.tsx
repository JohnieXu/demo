import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@lynx-js/react'
import type { InputProps, NodesRef } from '@lynx-js/types'
import { cn } from '../theme/cn'
import { createNamespace, isDef, toNumber } from '../utils'
import type { StepperProps } from './types'

const bem = createNamespace('stepper')

function formatNumber(value: number, options: {
  integer?: boolean
  decimalLength?: number
}): number {
  let num = value
  if (options.integer) {
    num = Math.round(num)
  } else if (isDef(options.decimalLength) && options.decimalLength! >= 0) {
    const factor = 10 ** options.decimalLength!
    num = Math.round(num * factor) / factor
  }
  return num
}

function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

function formatStepperValue(
  value: number | string | undefined,
  options: {
    min: number
    max: number
    integer: boolean
    decimalLength?: number
    allowEmpty: boolean
  },
): number | string {
  if ((value === undefined || value === '') && options.allowEmpty) {
    return ''
  }
  const num = toNumber(value)
  const clamped = clamp(num, options.min, options.max)
  return formatNumber(clamped, { integer: options.integer, decimalLength: options.decimalLength })
}

export function Stepper(props: StepperProps) {
  const {
    value: valueProp,
    defaultValue = 1,
    min: minProp = Number.NEGATIVE_INFINITY,
    max: maxProp = Number.POSITIVE_INFINITY,
    step: stepProp = 1,
    integer = false,
    disabled = false,
    disableInput = false,
    inputWidth,
    buttonSize,
    theme = 'default',
    allowEmpty = false,
    decimalLength,
    onChange,
    onOverlimit,
    onPlus,
    onMinus,
    className,
    style,
    ...rest
  } = props

  const min = toNumber(minProp)
  const max = toNumber(maxProp)
  const step = toNumber(stepProp)

  const options = useMemo(
    () => ({ min, max, integer, decimalLength, allowEmpty }),
    [min, max, integer, decimalLength, allowEmpty],
  )

  const isControlled = isDef(valueProp)
  const [innerValue, setInnerValue] = useState<number | string>(() =>
    formatStepperValue(defaultValue, options),
  )

  const currentValue = isControlled
    ? formatStepperValue(valueProp, options)
    : innerValue

  const inputRef = useRef<NodesRef>(null)

  useEffect(() => {
    inputRef.current?.invoke({
      method: 'setValue',
      params: { value: String(currentValue) },
    })
  }, [currentValue])

  const setValue = useCallback(
    (nextValue: number | string) => {
      const formatted = formatStepperValue(nextValue, options)
      if (!isControlled) {
        setInnerValue(formatted)
      }
      if (String(formatted) !== String(currentValue)) {
        onChange?.(formatted)
      }
    },
    [isControlled, currentValue, onChange, options],
  )

  const handlePlus = useCallback(() => {
    if (disabled) return
    const num = toNumber(currentValue)
    if (num >= max) {
      onOverlimit?.('plus', currentValue)
      return
    }
    onPlus?.()
    setValue(num + step)
  }, [disabled, currentValue, max, step, onPlus, onOverlimit, setValue])

  const handleMinus = useCallback(() => {
    if (disabled) return
    const num = toNumber(currentValue)
    if (num <= min) {
      onOverlimit?.('minus', currentValue)
      return
    }
    onMinus?.()
    setValue(num - step)
  }, [disabled, currentValue, min, step, onMinus, onOverlimit, setValue])

  const handleInput = useCallback(
    (event: { detail: { value: string } }) => {
      if (disabled || disableInput) return
      const raw = event.detail.value
      if (raw === '' && allowEmpty) {
        setValue('')
        return
      }
      const sanitized = integer
        ? raw.replace(/[^\d-]/g, '')
        : raw.replace(/[^\d.-]/g, '')
      setValue(sanitized)
    },
    [disabled, disableInput, integer, allowEmpty, setValue],
  )

  const handleBlur = useCallback(() => {
    if (disabled || disableInput) return
    setValue(currentValue)
  }, [disabled, disableInput, currentValue, setValue])

  const inputType = integer ? 'number' : 'digit'

  const minusDisabled = disabled || toNumber(currentValue) <= min
  const plusDisabled = disabled || toNumber(currentValue) >= max

  const cssVars = useMemo(() => {
    const vars: Record<string, string> = {}
    if (isDef(inputWidth)) {
      vars['--lu-stepper-input-width'] = typeof inputWidth === 'number'
        ? `${inputWidth}px`
        : String(inputWidth)
    }
    if (isDef(buttonSize)) {
      vars['--lu-stepper-button-size'] = typeof buttonSize === 'number'
        ? `${buttonSize}px`
        : String(buttonSize)
    }
    return vars
  }, [inputWidth, buttonSize])

  return (
    <view
      {...rest}
      className={cn(
        bem({
          disabled,
          round: theme === 'round',
        }),
        className,
      )}
      style={{ ...style, ...cssVars }}
    >
      <view
        className={cn(bem('button', { disabled: minusDisabled }), bem('minus'))}
        bindtap={handleMinus}
      >
        <text className={bem('icon')}>-</text>
      </view>
      <input
        {...({
          ref: inputRef,
          className: bem('input'),
          type: inputType,
          value: String(currentValue),
          readonly: disabled || disableInput,
          bindinput: handleInput,
          bindblur: handleBlur,
        } as InputProps)}
      />
      <view
        className={cn(bem('button', { disabled: plusDisabled }), bem('plus'))}
        bindtap={handlePlus}
      >
        <text className={bem('icon')}>+</text>
      </view>
    </view>
  )
}

export type { StepperProps } from './types'
