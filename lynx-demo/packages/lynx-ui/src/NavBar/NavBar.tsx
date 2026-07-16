import type { CSSProperties } from '@lynx-js/types'
import { cn } from '../theme/cn'
import { addUnit, createNamespace } from '../utils'
import type { NavBarProps } from './types'

const bem = createNamespace('nav-bar')

const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
  <path d="M10.65 3.146a.5.5 0 010 .708L5.207 8l5.44 4.146a.5.5 0 01-.686.73l-.024-.024-5.793-4.5a.5.5 0 010-.73l5.793-4.5a.5.5 0 01.686.73l-.024.024z"/>
</svg>
`

export function NavBar(props: NavBarProps) {
  const {
    title,
    fixed = false,
    border = true,
    zIndex = 1,
    leftText,
    rightText,
    leftArrow = false,
    leftDisabled = false,
    rightDisabled = false,
    leftChildren,
    rightChildren,
    className,
    style,
    onClickLeft,
    onClickRight,
  } = props

  const wrapperStyle: CSSProperties = {
    zIndex: addUnit(zIndex),
    ...style,
  }

  const renderLeft = () => (
    <view
      className={bem('left', { disabled: leftDisabled })}
      bindtap={leftDisabled ? undefined : onClickLeft}
    >
      {leftArrow && (
        <view className={bem('arrow')}>
          <svg src={ARROW_SVG} className={bem('arrow-icon')} />
        </view>
      )}
      {leftText != null && <text className={bem('text')}>{leftText}</text>}
      {leftChildren != null && leftChildren}
    </view>
  )

  const renderRight = () => (
    <view
      className={bem('right', { disabled: rightDisabled })}
      bindtap={rightDisabled ? undefined : onClickRight}
    >
      {rightText != null && <text className={bem('text')}>{rightText}</text>}
      {rightChildren != null && rightChildren}
    </view>
  )

  const renderTitle = () => (
    <view className={bem('title')}>
      {typeof title === 'string' || typeof title === 'number' ? (
        <text>{title}</text>
      ) : (
        title
      )}
    </view>
  )

  const content = (
    <view
      className={cn(
        bem({ fixed, border, 'safe-area-top': false }),
        className,
      )}
      style={wrapperStyle}
    >
      {renderLeft()}
      {renderTitle()}
      {renderRight()}
    </view>
  )

  return content
}

export type { NavBarProps } from './types'
