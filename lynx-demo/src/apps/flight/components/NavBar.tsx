import { forwardRef, Ref, type ReactNode, MainThreadRef, RefObject, useMainThreadRef } from "@lynx-js/react"
import { useNavigate } from "react-router"
import { Icon } from "lynx-ui"
import IconCheveronLeftSvg from "@assets/flight/svg/chevron-left.svg"
import IconCheveronLeftPng from "@assets/flight/images/chevron-left.png"
import "./NavBar.scss"
import type { CSSProperties, NodesRef, MainThread } from "@lynx-js/types"
import type { Element } from "@lynx-js/types/main-thread"
import { useMainThreadImperativeHandle } from "@lynx-js/react-use"

export interface INavbarRef {
  setOpacity: (opacity: number) => void
}
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
  'main-thread:ref'?: MainThreadRef<INavbarRef | null>
}

export const NavBar = forwardRef(NavBarIpl)

export function NavBarIpl(props: NavBarProps, ref: Ref<MainThreadRef<Element>>) {
  console.log(props)
  const { title, prefixText, renderLeft, renderCenter, renderRight, backgroundOpacity = 1, 'main-thread:ref': MTref } = props
  const navigate = useNavigate()

  const navBarRef = useMainThreadRef<Element>(null)
  const bgRef = useMainThreadRef<Element>(null)

  function handleBackTap() {
    navigate(-1)
  }

  // useEffect(() => {
  //   console.log('backgroundOpacity', backgroundOpacity)
  // }, [backgroundOpacity])

  // TODO: use MTS api to set background color for better performance
  const style: CSSProperties = {
    // '--nav-bar-bg-opacity': backgroundOpacity, // this not work, why???
    // backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
  }

  useMainThreadImperativeHandle(MTref, () => {
    'main thread';
    const setOpacity = (opacity: number) => {
      'main thread';
      if (bgRef && bgRef.current) {
        bgRef.current.setStyleProperty('opacity', opacity.toString())
      }
    }
    return {
      setOpacity,
    }
  }, [])

  return (
    <view
      main-thread:ref={navBarRef}
      className="nav-bar"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={style as any}
    >
      <view className="nav-bar__bg" main-thread:ref={bgRef}></view>
      <view className="nav-bar__left" bindtap={renderLeft ? undefined : handleBackTap}>
        {renderLeft ? renderLeft() : (
          <view>
            {/* FIXME: the size is required for <image> to work */}
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