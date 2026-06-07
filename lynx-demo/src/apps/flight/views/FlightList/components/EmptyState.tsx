import './EmptyState.scss'

interface EmptyStateProps {
  text?: string
}

export function EmptyState({ text = '暂无航班信息' }: EmptyStateProps) {
  return (
    <view className="empty-state">
      <text className="empty-state__text">{text}</text>
    </view>
  );
}
