import { Icon } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

// Icon accepts a raw SVG XML string as its `svg` source (see Icon/types.ts),
// so demos need no external asset files. Color is baked into the fill.
const star = (fill: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}">` +
  `<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>` +
  `</svg>`

const heart = (fill: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}">` +
  `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>` +
  `</svg>`

export function IconDemo() {
  return (
    <view>
      <DemoBlock title="尺寸 Size">
        <view className="demo-row demo-row--center">
          <Icon svg={star('#ff5712')} size={24} />
          <Icon svg={star('#ff5712')} size={32} />
          <Icon svg={star('#ff5712')} size={48} />
        </view>
      </DemoBlock>

      <DemoBlock title="颜色 Color">
        <view className="demo-row demo-row--center">
          <Icon svg={heart('#ee0a24')} size={32} />
          <Icon svg={heart('#07c160')} size={32} />
          <Icon svg={heart('#1989fa')} size={32} />
        </view>
      </DemoBlock>
    </view>
  )
}
