import { useNavigate } from "react-router"
import IconCheveronLeft from "@assets/flight/svg/chevron-left.svg"
import "./NavBar.scss"

export interface NavBarProps {
  prefixText?: string
  title?: string
}

export function NavBar({ title, prefixText }: NavBarProps) {

  const navigate = useNavigate()

  function handleBackTap() {
    navigate(-1)
  }

  return (
    <view className="nav-bar">
      <view className="nav-bar__left" bindtap={handleBackTap}>
        <svg className="icon" src={IconCheveronLeft}></svg>
        { prefixText ? <text className="text">{prefixText}</text> : null }
      </view>
      <view className="nav-bar__center">
        { title ? <text className="text">{title}</text> : null }
      </view>
      <view className="nav-bar__right"></view>
    </view>
  )
}