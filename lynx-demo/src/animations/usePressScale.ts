import { useSpring } from '@react-spring/web'
import type { SpringConfig } from '@react-spring/web'
import { swift } from './presets'
import { createPressScaleMTS } from './mts/pressScale'

export type PressScaleOptions = {
  pressedScale?: number
  config?: SpringConfig
  delay?: number
}

export function usePressScale(opts: PressScaleOptions = {}) {
  const { pressedScale = 0.96, config = swift, delay = 0 } = opts

  const [springs, api] = useSpring(() => ({
    from: { scale: 1 },
    config,
  }))

  const pressIn = () => {
    api.start({ to: { scale: pressedScale }, delay })
  }
  const pressOut = () => {
    api.start({ to: { scale: 1 }, delay: 0 })
  }

  const style = {
    transform: springs.scale.to((s) => `scale(${s})`),
  }

  const mts = createPressScaleMTS({ pressedScale })

  return { style, pressIn, pressOut, api, mts }
}
