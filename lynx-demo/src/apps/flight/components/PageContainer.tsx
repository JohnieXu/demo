import { type ReactNode } from 'react'
import { NavBar, NavBarProps } from './NavBar';
import './PageContainer.scss'

export interface PageContainerProps {
  showNavBar?: boolean
  title?: string
  navBarProps?: NavBarProps
  className?: string
  style?: Record<string, string | number>
  children?: ReactNode
}

export function PageContainer({
  showNavBar = false,
  navBarProps,
  className,
  style,
  children,
}: PageContainerProps) {
  return (
    <view className={`page-container ${className || ''}`} style={style}>
      {showNavBar && <NavBar {...navBarProps} />}
      {children}
    </view>
  )
}