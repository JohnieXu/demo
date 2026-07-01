import type { ReactNode } from '@lynx-js/react'

export interface DemoBlockProps {
  /** Small section heading above the demo card. */
  title: string
  children: ReactNode
}

/**
 * A titled demo section, mirroring Vant's DemoBlock: a lowercase-ish caption
 * followed by a surface card holding the live example.
 */
export function DemoBlock({ title, children }: DemoBlockProps) {
  return (
    <view className="demo-block">
      <text className="demo-block__title">{title}</text>
      <view className="demo-block__card">{children}</view>
    </view>
  )
}
