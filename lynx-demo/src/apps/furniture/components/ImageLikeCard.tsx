import type { ImageCardProps } from "./ImageCard";
import ImageCard from "./ImageCard";
import LikeIcon from "./LikeIcon";

export interface ImageLikeCardProps extends ImageCardProps {
  liked?: boolean;
}

export default function ImageLikeCard(props: ImageLikeCardProps) {
  const { liked, ...imageCardProps } = props;
  return (
    <view className="image-like-card">
      <ImageCard {...imageCardProps}></ImageCard>
      <LikeIcon liked={liked}></LikeIcon>
    </view>
  )
}