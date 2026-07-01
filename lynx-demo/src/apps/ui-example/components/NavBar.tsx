import { useNavigate } from 'react-router'

export interface NavBarProps {
  title?: string
}

/**
 * Lightweight top bar for demo pages: a back affordance on the left and a
 * centered title. Intentionally self-contained (no shared assets) so the
 * example app has no coupling to any specific business app.
 */
export function NavBar({ title }: NavBarProps) {
  const navigate = useNavigate()

  return (
    <view className="nav-bar">
      <view className="nav-bar__back" bindtap={() => navigate(-1)}>
        <text className="nav-bar__back-icon">‹</text>
      </view>
      <text className="nav-bar__title">{title}</text>
      {/* Spacer to keep the title visually centered against the back button. */}
      <view className="nav-bar__spacer" />
    </view>
  )
}
