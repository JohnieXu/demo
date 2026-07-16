import { useEffect, useMemo, useState } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace, padZero } from '../utils'
import { RollingTextItem } from './RollingTextItem'
import type { RollingTextProps } from './types'

const bem = createNamespace('rolling-text')
const CIRCLE_NUM = 2

export function RollingText(props: RollingTextProps) {
  const {
    startNum = 0,
    targetNum,
    textList = [],
    duration = 2,
    autoStart = true,
    direction = 'down',
    stopOrder = 'ltr',
    height = 40,
    className,
    style,
  } = props

  const [rolling, setRolling] = useState(autoStart)

  useEffect(() => {
    setRolling(autoStart)
  }, [autoStart])

  const isCustomType = textList.length > 0

  const itemLength = useMemo(() => {
    if (isCustomType) return textList[0].length
    return `${Math.max(startNum, targetNum ?? 0)}`.length
  }, [isCustomType, textList, startNum, targetNum])

  const getTextArrByIdx = (idx: number) => {
    const result: string[] = []
    for (let i = 0; i < textList.length; i++) {
      result.push(textList[i][idx])
    }
    return result
  }

  const targetNumArr = useMemo(() => {
    if (isCustomType) return new Array(itemLength).fill('')
    return padZero(targetNum ?? 0, itemLength).split('')
  }, [isCustomType, itemLength, targetNum])

  const startNumArr = useMemo(
    () => padZero(startNum, itemLength).split(''),
    [startNum, itemLength],
  )

  const getFigureArr = (i: number) => {
    const start = +startNumArr[i]
    const target = +targetNumArr[i]
    const result: number[] = []
    for (let n = start; n <= 9; n++) {
      result.push(n)
    }
    for (let c = 0; c <= CIRCLE_NUM; c++) {
      for (let n = 0; n <= 9; n++) {
        result.push(n)
      }
    }
    for (let n = 0; n <= target; n++) {
      result.push(n)
    }
    return result
  }

  const getDelay = (i: number) => {
    if (stopOrder === 'ltr') return 0.2 * i
    return 0.2 * (itemLength - 1 - i)
  }

  return (
    <view className={cn(bem(), className)} style={style}>
      {targetNumArr.map((_, i) => (
        <RollingTextItem
          key={i}
          figureArr={isCustomType ? getTextArrByIdx(i) : getFigureArr(i)}
          duration={duration}
          direction={direction}
          isStart={rolling}
          height={height}
          delay={getDelay(i)}
        />
      ))}
    </view>
  )
}

export type { RollingTextProps, RollingTextDirection, RollingTextStopOrder } from './types'
