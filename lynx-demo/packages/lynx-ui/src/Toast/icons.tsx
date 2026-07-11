export function LoadingIcon() {
  return <view className="lu-toast__spinner" />
}

export function SuccessIcon() {
  return (
    <view className="lu-toast__icon lu-toast__icon--success">
      <view className="lu-toast__check" />
    </view>
  )
}

export function FailIcon() {
  return (
    <view className="lu-toast__icon lu-toast__icon--fail">
      <view className="lu-toast__cross lu-toast__cross--first" />
      <view className="lu-toast__cross lu-toast__cross--second" />
    </view>
  )
}
