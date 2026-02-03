import "./app.scss"
import Gallery from "./components/Gallery"
import { furnituresPictures } from "./furniturePictures.js"

export function App() {
  return (
    <view className="single-card">
      <Gallery pictures={furnituresPictures}></Gallery>
    </view>
  )
}