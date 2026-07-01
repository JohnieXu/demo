import type { ReactNode } from '@lynx-js/react'
import { NavBar } from './NavBar'

export interface DemoPageProps {
  title?: string
  children: ReactNode
}

/**
 * Scaffold for a single component's demo page: fixed NavBar on top and a
 * vertically scrollable body holding the demo blocks.
 */
export function DemoPage({ title, children }: DemoPageProps) {
  return (
    <view className="demo-page">
      <NavBar title={title} />
      <scroll-view
        className="demo-page__body"
        scroll-orientation="vertical"
        scroll-y
      >
        {children}
      </scroll-view>
    </view>
  )
}
