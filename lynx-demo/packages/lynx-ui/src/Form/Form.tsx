import { useCallback, useEffect, useMemo, useRef, useState } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import { FormContext } from './context'
import type { FieldInstance } from './context'
import type { FormInstance, FormProps } from './types'

const bem = createNamespace('form')

export function Form(props: FormProps & { form?: FormInstance }) {
  const {
    initialValues = {},
    children,
    className,
    style,
    onFinish,
    onFinishFailed,
    onValuesChange,
    form,
  } = props

  const fieldsRef = useRef<Record<string, FieldInstance>>({})
  const [values, setValues] = useState<Record<string, string | number | undefined>>(
    () => ({ ...initialValues }),
  )
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  const getFieldsValue = useCallback(
    () => ({ ...values }),
    [values],
  )

  const setFieldsValue = useCallback(
    (next: Record<string, string | number | undefined>) => {
      setValues((prev) => {
        const merged = { ...prev, ...next }
        onValuesChange?.(next, merged)
        return merged
      })
    },
    [onValuesChange],
  )

  const setFieldValue = useCallback(
    (name: string, value: string | number) => {
      setValues((prev) => {
        const merged = { ...prev, [name]: value }
        onValuesChange?.({ [name]: value }, merged)
        return merged
      })
    },
    [onValuesChange],
  )

  const getFieldError = useCallback(
    (name: string) => errors[name],
    [errors],
  )

  const setFieldError = useCallback((name: string, error: string | undefined) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  const validateField = useCallback(async (name: string) => {
    const field = fieldsRef.current[name]
    if (!field) return undefined
    const val = values[name]
    const strVal = val === undefined || val === null ? '' : String(val)

    const rules = field.rules ?? []
    for (const rule of rules) {
      if (rule.required && strVal.trim() === '') {
        const message = rule.message || `${name} 不能为空`
        setFieldError(name, message)
        return message
      }
      if (rule.pattern && !rule.pattern.test(strVal)) {
        const message = rule.message || `${name} 格式不正确`
        setFieldError(name, message)
        return message
      }
      if (rule.validator) {
        try {
          const result = await rule.validator(val ?? '', rule)
          if (result !== true) {
            const message = typeof result === 'string' ? result : rule.message || `${name} 校验失败`
            setFieldError(name, message)
            return message
          }
        } catch {
          const message = rule.message || `${name} 校验失败`
          setFieldError(name, message)
          return message
        }
      }
    }
    setFieldError(name, undefined)
    return undefined
  }, [values, setFieldError])

  const validateAll = useCallback(async () => {
    const names = Object.keys(fieldsRef.current)
    const results = await Promise.all(
      names.map(async (name) => ({ name, error: await validateField(name) })),
    )
    const nextErrors: Record<string, string | undefined> = {}
    let hasError = false
    results.forEach(({ name, error }) => {
      nextErrors[name] = error
      if (error) hasError = true
    })
    setErrors(nextErrors)
    return !hasError
  }, [validateField])

  const submit = useCallback(async () => {
    const isValid = await validateAll()
    if (isValid) {
      onFinish?.(getFieldsValue())
    } else {
      onFinishFailed?.(errors, getFieldsValue())
    }
  }, [validateAll, onFinish, onFinishFailed, getFieldsValue, errors])

  const reset = useCallback(() => {
    setValues({ ...initialValues })
    setErrors({})
    Object.values(fieldsRef.current).forEach((field) => field.reset())
  }, [initialValues])

  const registerField = useCallback((field: FieldInstance) => {
    fieldsRef.current[field.name] = field
    setValues((prev) => {
      const hasDefault =
        field.defaultValue !== undefined && field.defaultValue !== ''
      if (!(field.name in prev) && hasDefault) {
        return { ...prev, [field.name]: field.defaultValue }
      }
      return prev
    })
  }, [])

  const unregisterField = useCallback((name: string) => {
    delete fieldsRef.current[name]
  }, [])

  useEffect(() => {
    if (!form) return
    form.submit = submit
    form.reset = reset
    form.validate = validateAll
    form.getFieldsValue = getFieldsValue
    form.setFieldsValue = setFieldsValue
    form.getFieldError = getFieldError
    form.setFieldError = setFieldError
  }, [form, submit, reset, validateAll, getFieldsValue, setFieldsValue, getFieldError, setFieldError])

  const contextValue = useMemo(
    () => ({
      values,
      errors,
      registerField,
      unregisterField,
      setFieldValue,
      validateField,
      validateAll,
      submit,
    }),
    [
      values,
      errors,
      registerField,
      unregisterField,
      setFieldValue,
      validateField,
      validateAll,
      submit,
    ],
  )

  return (
    <FormContext.Provider value={contextValue}>
      <view className={cn(bem(), className)} style={style}>
        {children}
      </view>
    </FormContext.Provider>
  )
}

export type { FormProps, FormInstance } from './types'
