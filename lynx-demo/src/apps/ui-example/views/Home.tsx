import { useNavigate } from 'react-router'
import { DEMOS } from '../registry'
import { ThemeToggle } from '../components/ThemeToggle'

export function Home() {
  const navigate = useNavigate()

  // Distinct categories, preserving first-seen order (avoids relying on
  // Set-spread downlevel iteration).
  const categories = DEMOS.reduce<string[]>(
    (acc, demo) => (acc.includes(demo.category) ? acc : [...acc, demo.category]),
    [],
  )

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
      >
        {categories.map((category) => (
          <view key={category} className="home__group">
            <text className="home__group-title">{category}</text>
            {DEMOS.filter((demo) => demo.category === category).map((demo) => (
              <view
                key={demo.key}
                className="home__item"
                bindtap={() => navigate(`/component/${demo.key}`)}
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
