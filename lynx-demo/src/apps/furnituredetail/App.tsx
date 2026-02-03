import { CardDetail } from "./components/CardDetail";
import { OrderButton } from "./components/OrderButton";
import { Swiper } from "./components/Swiper/SwiperV2";

import './index.scss'

export default function App() {
  const picList = [
    "https://plus.unsplash.com/premium_photo-1762548729781-cf15430fc131?q=80&w=1384&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1763013373865-ba19073fbdea?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1764435536894-a443e2bec95d?q=80&w=1284&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1764501818547-52daac608a44?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ]
  return (
    <view style={{display: 'flex', flexDirection: 'column', flex: '1', height: '100%', backgroundColor: '#000'}}>
      <Swiper data={picList}></Swiper>
      <view style={{position: 'absolute', bottom: '50px', width: '100%'}}>
        <CardDetail></CardDetail>
        <OrderButton></OrderButton>
      </view>
    </view>
  )
}
