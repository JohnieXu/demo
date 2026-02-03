import { useState } from "@lynx-js/react"
import redHeart from "../../../assets/Pictures/redHeart.png"
import whiteHeart from "../../../assets/Pictures/whiteHeart.png"
import "./LikeIcon.scss"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function LikeIcon(props: { liked?: boolean }) {
  const [liked, setLiked] = useState(false)
  function onTap() {
    setLiked(!liked)
  }
  return (
    <view className="like-icon" bindtap={onTap}>
      {liked && <view className="circle"></view>}
      {liked && <view className="circle circleAfter"></view>}
      <image src={liked ? redHeart : whiteHeart} className="heart-love"></image>
    </view>
  )
}