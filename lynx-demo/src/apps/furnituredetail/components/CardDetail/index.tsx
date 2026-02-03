// import redHeart from "../../../assets/Pictures/redHeart.png"
import whiteHeart from "@assets/Pictures/whiteHeart.png"
import './index.scss'

export function CardDetail() {
  return (
    <view className="card-detail">
      <view style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <text className='card-detail__price'>￥1314</text>
        <text className='card-detail__sold'>Sold 1000+</text>
      </view>
      <view style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <text className='card-detail__description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, sapiente iste? In sapiente officiis dicta. Illo!</text>
        <image src={whiteHeart} mode="aspectFill" className="like-icon"></image>
      </view>
    </view>
  )
}