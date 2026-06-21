import { forwardRef, Ref, type ReactNode, MainThreadRef, useMainThreadRef, useImperativeHandle, runOnMainThread } from "@lynx-js/react"
import { useNavigate } from "react-router"
import { Icon } from "lynx-ui"
import IconCheveronLeftSvg from "@assets/flight/svg/chevron-left.svg"
import IconCheveronLeftPng from "@assets/flight/images/chevron-left.png"
import "./NavBar.scss"
import type { Element } from "@lynx-js/types/main-thread"
import { useMainThreadImperativeHandle } from "@lynx-js/react-use"

export interface INavbarRefMT {
  setOpacity: (opacity: number) => void
}
export interface INavbarRefBT {
  setOpacity: (opacity: number) => void
}
export interface NavBarProps {
  prefixText?: string
  title?: string
  renderLeft?: () => ReactNode
  renderCenter?: () => ReactNode
  renderRight?: () => ReactNode
  'main-thread:ref'?: MainThreadRef<INavbarRefMT | null>
}

export const NavBar = forwardRef(NavBarIpl)

export function NavBarIpl(props: NavBarProps, ref: Ref<INavbarRefBT | null>) {
  console.log(props)
  const { title, prefixText, renderLeft, renderCenter, renderRight, 'main-thread:ref': MTref } = props
  const navigate = useNavigate()

  const navBarRef = useMainThreadRef<Element>(null)
  const bgRef = useMainThreadRef<Element>(null)

  function handleBackTap() {
    navigate(-1)
  }

  const setOpacity = (opacity: number) => {
    'main thread';
    if (bgRef && bgRef.current) {
      bgRef.current.setStyleProperty('opacity', opacity.toString())
    }
  }

  useImperativeHandle(ref, () => ({
    setOpacity: (opacity: number) => {
      'background only';
      runOnMainThread(setOpacity)(opacity)
    },
  }))

  useMainThreadImperativeHandle(MTref, () => {
    'main thread';
    return {
      setOpacity,
    }
  }, [])

  return (
    <view
      main-thread:ref={navBarRef}
      className="nav-bar"
    >
      <view className="nav-bar__bg" main-thread:ref={bgRef}></view>
      <view className="nav-bar__left" bindtap={renderLeft ? undefined : handleBackTap}>
        {renderLeft ? renderLeft() : (
          <view>
            {/* FIX: the size is required for <image> to work */}
            <Icon svg={IconCheveronLeftSvg} png={IconCheveronLeftPng} size={24} className="icon" />
            { prefixText ? <text className="text">{prefixText}</text> : null }
          </view>
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