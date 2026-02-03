import type { Picture } from "../furniturePictures"
import LikeIcon from "./LikeIcon"
import "./ImageCard.scss"

export interface ImageCardProps {
  picture: Picture
}

export default function ImageCard(props: ImageCardProps) {
  const { picture } = props
  return (
    <view className="image-card">
      <image className="image" src={picture.src} style={{ aspectRatio: picture.width/picture.height }}/>
      {/* <text style={{ color: "#fff" }}>{JSON.stringify(picture)}</text> */}
      <LikeIcon></LikeIcon>
    </view>
  )
}