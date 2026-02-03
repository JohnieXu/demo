import { useSpring } from '@react-spring/web'
import type { SpringConfig } from '@react-spring/web'
import { useEffect } from '@lynx-js/react'
import { gentle } from './presets'
import { toTransform } from './helpers'
import { applyEnterFadeMTS, createEnterFadeMTSEvent, applyEnterFadeFromMTS } from './mts/enterFade'
import type { Element } from '@lynx-js/types/main-thread'

export type EnterFadeVector = { opacity?: number; x?: number; y?: number; scale?: number }

export type EnterFadeOptions = {
  visible?: boolean
  from?: EnterFadeVector
  to?: EnterFadeVector
  config?: SpringConfig
  delay?: number
  immediate?: boolean
}

export function useEnterFade(opts: EnterFadeOptions = {}) {
  const {
    visible = true,
    from = { opacity: 0, y: 12, scale: 0.98 },
    to = { opacity: 1, y: 0, scale: 1 },
    config = gentle,
    delay = 0,
    immediate,
  } = opts

  const fromTarget = {
    opacity: from.opacity ?? 0,
    transform: toTransform({ x: from.x ?? 0, y: from.y ?? 12, scale: from.scale ?? 0.98 }),
  }
  const toTarget = {
    opacity: to.opacity ?? 1,
    transform: toTransform({ x: to.x ?? 0, y: to.y ?? 0, scale: to.scale ?? 1 }),
  }

  const [styles, api] = useSpring(() => ({
    from: fromTarget,
    config,
    delay,
    immediate,
  }))

  useEffect(() => {
    api.start({
      to: visible ? toTarget : fromTarget,
      delay,
      config,
      immediate,
    })
  }, [visible, delay, immediate, config, api])

  return [styles, api] as const
}

export function createEnterFadeMTS(opts: EnterFadeOptions = {}) {
  const from = {
    opacity: opts.from?.opacity ?? 0,
    x: opts.from?.x ?? 0,
    y: opts.from?.y ?? 12,
    scale: opts.from?.scale ?? 0.98,
  }
  const to = {
    opacity: opts.to?.opacity ?? 1,
    x: opts.to?.x ?? 0,
    y: opts.to?.y ?? 0,
    scale: opts.to?.scale ?? 1,
  }
  const duration = 220
  const easing = 'cubic-bezier(0.22, 1, 0.36, 1)'
  const applyToTarget = (target: Element) => {
    'main thread'
    return applyEnterFadeMTS(target, { from, to, duration, easing })
  }
  const applyFromToTarget = (target: Element) => {
    'main thread'
    return applyEnterFadeFromMTS(target, { from, to, duration, easing })
  }
  const handler = createEnterFadeMTSEvent({ from, to, duration, easing })
  return { applyToTarget, applyFromToTarget, handler }
}
