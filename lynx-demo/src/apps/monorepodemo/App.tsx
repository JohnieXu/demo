import { useState } from '@lynx-js/react'
import { animated, useSpring } from 'react-spring-lynx'
import { Button } from 'lynx-ui'
import { CSSProperties } from '@lynx-js/types'

const AnimatedView = animated.view
const AnimatedText = animated.text

export default function App() {
  const [toggle, setToggle] = useState(false)

  const styles = useSpring({
    opacity: toggle ? 1 : 0.3,
    transform: toggle ? 'scale(1.1) rotate(45deg)' : 'scale(1) rotate(0deg)',
    backgroundColor: toggle ? '#007aff' : '#ff3b30',
    config: { tension: 170, friction: 26 },
  })

  return (
    <view style={containerStyle}>
      <AnimatedView
        style={{
          ...boxStyle,
          ...styles,
        }}
      >
        <AnimatedText style={textStyle}>{toggle ? 'ACTIVE' : 'IDLE'}</AnimatedText>
      </AnimatedView>

      <view style={buttonWrapStyle}>
        <Button onClick={() => setToggle(!toggle)} label="点击切换动画状态" />
      </view>
    </view>
  )
}

const containerStyle: CSSProperties = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f5f5f7',
}

const boxStyle = {
  width: '150px',
  height: '150px',
  borderRadius: '30px',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
}

const textStyle: CSSProperties = {
  color: 'white',
  fontSize: '20px',
  fontWeight: 'bold',
}

const buttonWrapStyle: CSSProperties = {
  marginTop: '40px',
}
