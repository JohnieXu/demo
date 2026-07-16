import { useMemo } from '@lynx-js/react'
import { addUnit, createNamespace } from '../utils'
import type { RollingTextItemProps } from './types'

const bem = createNamespace('rolling-text-item')

export function RollingTextItem(props: RollingTextItemProps) {
  const {
    figureArr,
    delay = 0,
    duration = 2,
    isStart = false,
    direction = 'down',
    height = 40,
  } = props

  const newFigureArr = useMemo(
    () => (direction === 'down' ? [...figureArr].reverse() : figureArr),
    [direction, figureArr],
  )

  const totalHeight = height * (figureArr.length - 1)
  const translatePx = `-${totalHeight}px`

  const itemStyle = {
    height: addUnit(height),
    lineHeight: addUnit(height),
  }

  const rootStyle = {
    height: addUnit(height),
    '--lu-rolling-text-translate': translatePx,
    '--lu-rolling-text-duration': `${duration}s`,
    '--lu-rolling-text-delay': `${delay}s`,
  } as Record<string, string | number>

  return (
    <view className={bem({ [direction]: true })} style={rootStyle}>
      <view className={bem('box', { animate: isStart })} style={itemStyle}>
        {newFigureArr.map((figure, index) => (
          <text key={index} className={bem('item')} style={itemStyle}>
            {figure}
          </text>
        ))}
      </view>
    </view>
  )
}
