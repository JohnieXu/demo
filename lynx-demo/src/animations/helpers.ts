import { easings } from '@react-spring/web'

export const easeOut = easings.easeOutCubic
export function toTransform(params: { x?: number; y?: number; scale?: number }) {
  const { x = 0, y = 0, scale = 1 } = params
  return `translate3d(${x}px, ${y}px, 0) scale(${scale})`
}

