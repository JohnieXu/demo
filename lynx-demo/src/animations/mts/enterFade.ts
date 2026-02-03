export type EnterFadeMTSVector = { opacity?: number; x?: number; y?: number; scale?: number }
export type EnterFadeMTSOptions = {
  from?: EnterFadeMTSVector
  to?: EnterFadeMTSVector
  duration?: number
  easing?: string
}

function toTransform(params: { x?: number; y?: number; scale?: number }) {
  'main thread'
  const { x = 0, y = 0, scale = 1 } = params
  return `translate3d(${x}px, ${y}px, 0) scale(${scale})`
}

export function applyEnterFadeFromMTS(target: any, opts: EnterFadeMTSOptions = {}) {
  'main thread'
  const from = opts.from ?? { opacity: 0, y: 12, scale: 0.98 }
  target.setStyleProperty('transition', '')
  target.setStyleProperty('opacity', String(from.opacity ?? 0))
  target.setStyleProperty('transform', toTransform({ x: from.x ?? 0, y: from.y ?? 12, scale: from.scale ?? 0.98 }))
}

export function applyEnterFadeMTS(target: any, opts: EnterFadeMTSOptions = {}) {
  'main thread'
  // const from = opts.from ?? { opacity: 0, y: 12, scale: 0.98 }
  const to = opts.to ?? { opacity: 1, y: 0, scale: 1 }
  const duration = opts.duration ?? 220
  const easing = opts.easing ?? 'cubic-bezier(0.22, 1, 0.36, 1)'
  target.setStyleProperty('transition', `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`)
  target.setStyleProperty('opacity', String(to.opacity ?? 1))
  target.setStyleProperty('transform', toTransform({ x: to.x ?? 0, y: to.y ?? 0, scale: to.scale ?? 1 }))
}

export function createEnterFadeMTSEvent(opts: EnterFadeMTSOptions = {}) {
  return (event: any) => {
    'main thread'
    applyEnterFadeMTS(event.currentTarget, opts)
  }
}
