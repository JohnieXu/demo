import { type ReactNode } from "react"
import { useNavigate } from "react-router"
import IconCheveronLeft from "@assets/flight/svg/chevron-left.svg"
import "./NavBar.scss"

export interface NavBarProps {
  prefixText?: string
  title?: string
  renderLeft?: () => ReactNode
  renderCenter?: () => ReactNode
  renderRight?: () => ReactNode
}

export function NavBar({ title, prefixText, renderLeft, renderCenter, renderRight }: NavBarProps) {

  const navigate = useNavigate()

  function handleBackTap() {
    navigate(-1)
  }

  return (
    <view className="nav-bar">
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