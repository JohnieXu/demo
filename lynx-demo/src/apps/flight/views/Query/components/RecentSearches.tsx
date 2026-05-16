import "./RecentSearches.scss"

export interface RecentSearchItem {
  text: string
}

export interface RecentSearchesProps {
  items: RecentSearchItem[]
}

export function RecentSearches({ items }: RecentSearchesProps) {
  return (
    <view className="recent-searches">
      <text className="recent-label recent-label-line1">最近查询</text>
      <scroll-view className="tags-scroll" scroll-orientation="horizontal">
        {items.map((item, index) => (
          <view key={index} className="tag">
            <text className="tag-text tag-text-dark">{item.text}</text>
          </view>
        ))}
      </scroll-view>
    </view>
  )
}