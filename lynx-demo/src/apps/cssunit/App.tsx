import "./app.scss"

function App() {
  return (
    <scroll-view className="App" scroll-orientation="vertical" bounces>
      <text>Css Unit Test</text>
      <text>pixelWidth {SystemInfo.pixelWidth}</text>
      <text>pixelRatio {SystemInfo.pixelRatio}</text>
      <view className="box box1">
        <text>200px</text>
      </view>
      <view className="box box2">
        <text>200rpx</text>
      </view>
      <view className="box box3">
        <text>200ppx</text>
      </view>
      <view className="box box4">
        <text>750rpx</text>
      </view>
    </scroll-view>
  );
}
export default App;
