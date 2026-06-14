import { useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router"
import IconCheveronLeft from "@assets/flight/svg/chevron-left.svg"
import "./NavBar.scss"
import { CSSProperties } from "@lynx-js/types"

export interface NavBarProps {
  prefixText?: string
  title?: string
  renderLeft?: () => ReactNode
  renderCenter?: () => ReactNode
  renderRight?: () => ReactNode
  /**
   * Opacity (0-1) of the NavBar's background. Useful for fade-on-scroll
   * effects driven by a scrollable view. @default 1
   */
  backgroundOpacity?: number
}

export function NavBar({ title, prefixText, renderLeft, renderCenter, renderRight, backgroundOpacity = 1 }: NavBarProps) {

  const navigate = useNavigate()

  function handleBackTap() {
    navigate(-1)
  }

  // useEffect(() => {
  //   console.log('backgroundOpacity', backgroundOpacity)
  // }, [backgroundOpacity])

  // TODO: use MTS api to set background color for better performance
  const style: CSSProperties = {
    // '--nav-bar-bg-opacity': backgroundOpacity, // this not work, why???
    backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
  }

  return (
    <view
      className="nav-bar"
      // CSS custom property isn't part of Lynx's CSSProperties type.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={style as any}
    >
      <view className="nav-bar__left" bindtap={renderLeft ? undefined : handleBackTap}>
        {renderLeft ? renderLeft() : (
          <>
            <svg className="icon" src={IconCheveronLeft}></svg>
            { prefixText ? <text className="text">{prefixText}</text> : null }
          </>
        )}
      </view>
      <view className="nav-bar__center">
        {renderCenter ? renderCenter() : (
          title ? <text className="text">{title}</text> : null
        )}
      </view>
      <view className="nav-bar__right">
        {renderRight ? renderRight() : <>
          <view className="icon icon--hidden" />
          <text className="text text--hidden">{prefixText}</text>
        </>}
      </view>
    </view>
  )
}