import { useEffect, useMemo, useRef, useState } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { cn } from '../theme/cn'
import { clamp, createNamespace, getSizeStyle, isDef, isObject } from '../utils'
import type { Numeric } from '../utils'
import type { CircleProps, CircleStartPosition } from './types'

const bem = createNamespace('circle')
const PERIMETER = 3140

function toNumber(val?: Numeric): number {
  if (!isDef(val)) return 0
  const num = Number(val)
  return Number.isNaN(num) ? 0 : num
}

function formatRate(rate?: Numeric): number {
  return clamp(toNumber(rate), 0, 100)
}

function getPath(clockwise: boolean, viewBoxSize: number): string {
  const sweepFlag = clockwise ? 1 : 0
  return `M ${viewBoxSize / 2} ${viewBoxSize / 2} m 0,-500 a 500,500 0 1,${sweepFlag} 0,1000 a 500,500 0 1,${sweepFlag} 0,-1000`
}

let uid = 0

const ROTATE_ANGLE_MAP: Record<CircleStartPosition, number> = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
}

export function Circle(props: CircleProps) {
  const {
    text,
    size,
    fill = 'none',
    rate = 100,
    speed = 0,
    color,
    clockwise = true,
    layerColor,
    currentRate: currentRateProp,
    strokeWidth = 40,
    strokeLinecap = 'round',
    startPosition = 'top',
    children,
    className,
    style,
    onUpdateCurrentRate,
  } = props

  const isControlled = currentRateProp !== undefined
  const [innerRate, setInnerRate] = useState(currentRateProp ?? 0)
  const displayRate = isControlled ? currentRateProp! : innerRate
  const displayRateRef = useRef(displayRate)

  useEffect(() => {
    displayRateRef.current = displayRate
  }, [displayRate])

  useEffect(() => {
    const target = formatRate(rate)
    const startRate = displayRateRef.current
    const speedValue = toNumber(speed)

    const update = (value: number) => {
      if (!isControlled) {
        setInnerRate(value)
      }
      onUpdateCurrentRate?.(value)
    }

    if (speedValue <= 0) {
      update(target)
      return
    }

    const duration = Math.abs(((startRate - target) * 1000) / speedValue)
    const startTime = Date.now()
    let rafId: number

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const value = progress * (target - startRate) + startRate
      update(formatRate(value))
      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [rate, speed, isControlled, onUpdateCurrentRate])

  const id = useMemo(() => `lu-circle-${uid++}`, [])
  const viewBoxSize = useMemo(
    () => toNumber(strokeWidth) + 1000,
    [strokeWidth],
  )
  const path = useMemo(
    () => getPath(clockwise, viewBoxSize),
    [clockwise, viewBoxSize],
  )

  const strokeColor = useMemo(() => {
    if (isObject(color)) return `url(#${id})`
    return color || 'var(--lu-color-primary)'
  }, [color, id])

  const svgString = useMemo(() => {
    const strokeWidthNum = toNumber(strokeWidth)
    const offset = (PERIMETER * displayRate) / 100
    const angle = ROTATE_ANGLE_MAP[startPosition]
    const center = viewBoxSize / 2

    let gradientDefs = ''
    if (isObject(color)) {
      const stops = Object.keys(color)
        .sort((a, b) => parseFloat(a) - parseFloat(b))
        .map((key) => `            <stop offset="${key}" stop-color="${color[key]}" />`)
        .join('\n')
      gradientDefs = `
          <defs>
            <linearGradient id="${id}" x1="100%" y1="0%" x2="0%" y2="0%">
${stops}
            </linearGradient>
          </defs>`
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}">
${gradientDefs}
          <g transform="rotate(${angle}, ${center}, ${center})">
            <path d="${path}" fill="${fill}" stroke="${layerColor || 'none'}" stroke-width="${strokeWidthNum}" />
            <path d="${path}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidthNum + 1}" stroke-linecap="${strokeLinecap}" stroke-dasharray="${offset},${PERIMETER}" />
          </g>
        </svg>`
  }, [
    color,
    displayRate,
    fill,
    id,
    layerColor,
    path,
    startPosition,
    strokeColor,
    strokeLinecap,
    strokeWidth,
    viewBoxSize,
  ])

  return (
    <view
      className={cn(bem(), className)}
      style={{ ...getSizeStyle(size), ...style } as CSSProperties}
    >
      <svg src={svgString} className={bem('svg')} />
      {children || (text ? <text className={bem('text')}>{text}</text> : null)}
    </view>
  )
}

export type { CircleProps, CircleStartPosition } from './types'
