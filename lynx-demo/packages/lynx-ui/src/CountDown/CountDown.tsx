import { useEffect, useMemo, useState } from '@lynx-js/react'
import { cn } from '../theme/cn'
import {
  createNamespace,
  padZero,
  useCountDownRuntime,
  type UseCountDownCurrent,
} from '../utils'
import type { Numeric } from '../utils'
import type { CountDownProps } from './types'

const bem = createNamespace('count-down')

function toNumber(val?: Numeric): number {
  if (val === undefined || val === null) return 0
  const num = Number(val)
  return Number.isNaN(num) ? 0 : num
}

function parseFormat(format: string, current: UseCountDownCurrent): string {
  const { days } = current
  let { hours, minutes, seconds, milliseconds } = current

  if (format.includes('DD')) {
    format = format.replace('DD', padZero(days))
  } else {
    hours += days * 24
  }

  if (format.includes('HH')) {
    format = format.replace('HH', padZero(hours))
  } else {
    minutes += hours * 60
  }

  if (format.includes('mm')) {
    format = format.replace('mm', padZero(minutes))
  } else {
    seconds += minutes * 60
  }

  if (format.includes('ss')) {
    format = format.replace('ss', padZero(seconds))
  } else {
    milliseconds += seconds * 1000
  }

  if (format.includes('S')) {
    const ms = padZero(milliseconds, 3)
    if (format.includes('SSS')) {
      format = format.replace('SSS', ms)
    } else if (format.includes('SS')) {
      format = format.replace('SS', ms.slice(0, 2))
    } else {
      format = format.replace('S', ms.charAt(0))
    }
  }

  return format
}

export function CountDown(props: CountDownProps) {
  const {
    time = 0,
    format = 'HH:mm:ss',
    autoStart = true,
    millisecond = false,
    children,
    className,
    style,
    onChange,
    onFinish,
  } = props

  const [current, setCurrent] = useState<UseCountDownCurrent>(() => ({
    total: toNumber(time),
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  }))

  const runtime = useCountDownRuntime({
    time: toNumber(time),
    millisecond,
    onChange: (value) => {
      setCurrent(value)
      onChange?.(value)
    },
    onFinish,
  })

  useEffect(() => {
    runtime.reset(toNumber(time))
    if (autoStart) {
      runtime.start()
    } else {
      runtime.pause()
    }
    // runtime is a mutable object returned by the hook; we intentionally
    // only react to user-facing props here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, autoStart])

  const timeText = useMemo(
    () => parseFormat(format, current),
    [format, current],
  )

  return (
    <text
      className={cn(bem(), className)}
      style={style}
    >
      {children ? children(current) : timeText}
    </text>
  )
}

export type { CountDownProps } from './types'
