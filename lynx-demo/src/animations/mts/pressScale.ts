export type PressScaleMTSOptions = {
  pressedScale?: number
  duration?: number
  easing?: string
}

export function createPressScaleMTS(opts: PressScaleMTSOptions = {}) {
  const pressedScale = opts.pressedScale ?? 0.96
  const duration = opts.duration ?? 160
  const easing = opts.easing ?? 'cubic-bezier(0.22, 1, 0.36, 1)'
  const onTouchStart = (event: any) => {
    'main thread'
    event.currentTarget.setStyleProperty('transition', '')
    event.currentTarget.setStyleProperty('transform', `scale(${pressedScale})`)
  }
  const onTouchEnd = (event: any) => {
    'main thread'
    event.currentTarget.setStyleProperty('transition', `transform ${duration}ms ${easing}`)
    event.currentTarget.setStyleProperty('transform', 'scale(1)')
  }
  return { onTouchStart, onTouchEnd }
}

