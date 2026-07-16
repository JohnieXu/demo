import { useContext } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { cn } from '../theme/cn'
import { createNamespace, isDef } from '../utils'
import type { Numeric } from '../utils'
import { RowIndexContext, RowContext } from '../Row/Row'
import type { ColProps } from './types'

const bem = createNamespace('col')

function toNumber(val?: Numeric): number {
  if (!isDef(val)) return 0
  const num = Number(val)
  return Number.isNaN(num) ? 0 : num
}

export function Col(props: ColProps) {
  const { span = 0, offset, children, className, style } = props
  const index = useContext(RowIndexContext)
  const { spaces, verticalSpaces } = useContext(RowContext)

  const space = spaces[index]
  const vSpace = verticalSpaces[index]

  const colStyle: CSSProperties = {
    paddingLeft: space?.left ? `${space.left}px` : undefined,
    paddingRight: space?.right ? `${space.right}px` : undefined,
    marginBottom: vSpace?.bottom ? `${vSpace.bottom}px` : undefined,
    ...style,
  }

  const spanNum = toNumber(span)
  const offsetNum = toNumber(offset)

  return (
    <view
      className={cn(
        bem({
          [String(spanNum)]: spanNum > 0,
          [`offset-${offsetNum}`]: offsetNum > 0,
        }),
        className,
      )}
      style={colStyle}
    >
      {children}
    </view>
  )
}

export type { ColProps } from './types'
