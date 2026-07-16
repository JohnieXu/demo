import { useNavigate, useOutletContext } from 'react-router'
import type { ScrollEvent } from '@lynx-js/types'
import { DEMOS } from '../registry'
import { ThemeToggle } from '../components/ThemeToggle'
import type { UiExampleContext } from '../App'

export function Home() {
  const navigate = useNavigate()
  const { getHomeScrollTop, setHomeScrollTop } = useOutletContext<UiExampleContext>()

  // Distinct categories, preserving first-seen order (avoids relying on
  // Set-spread downlevel iteration).
  const categories = DEMOS.reduce<string[]>(
    (acc, demo) => (acc.includes(demo.category) ? acc : [...acc, demo.category]),
    [],
  )

  const handleScroll = (e: ScrollEvent) => {
    'background only'
    setHomeScrollTop(e.detail.scrollTop ?? 0)
  }

  const handleItemTap = (key: string) => {
    // Capture the current scroll position right before navigation to avoid
    // any race between the last scroll event and the route transition.
    setHomeScrollTop(getHomeScrollTop())
    navigate(`/component/${key}`)
  }

  return (
    <view className="home">
      <view className="home__header">
        <text className="home__title">lynx-ui 组件示例</text>
        <ThemeToggle />
      </view>
      <scroll-view
        className="home__body"
        scroll-orientation="vertical"
        scroll-y
        initial-scroll-offset={getHomeScrollTop()}
        bindscroll={handleScroll}
      >
        {categories.map((category) => (
          <view key={category} className="home__group">
            <text className="home__group-title">{category}</text>
            {DEMOS.filter((demo) => demo.category === category).map((demo) => (
              <view
                key={demo.key}
                className="home__item"
                bindtap={() => handleItemTap(demo.key)}
              >
                <view className="home__item-main">
                  <text className="home__item-title">{demo.title}</text>
                  <text className="home__item-subtitle">{demo.subtitle}</text>
                </view>
                <text className="home__item-arrow">›</text>
              </view>
            ))}
          </view>
        ))}
      </scroll-view>
    </view>
  )
}
