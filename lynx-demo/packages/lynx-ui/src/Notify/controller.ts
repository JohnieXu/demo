import type { NotifyOptions, NotifyState } from './types'

function extend<T extends object>(
  target: T,
  ...sources: Array<Partial<T> | undefined>
): T {
  sources.forEach((source) => {
    if (source) {
      Object.assign(target, source)
    }
  })
  return target
}

const defaultOptions: NotifyOptions = {
  type: 'danger',
  message: '',
  duration: 3000,
  position: 'top',
  className: '',
}

let currentOptions: NotifyOptions = extend({}, defaultOptions)
let state: NotifyState | undefined
let idSeed = 0
const listeners = new Set<() => void>()

let closeTimer: ReturnType<typeof setTimeout> | null = null
let removeTimer: ReturnType<typeof setTimeout> | null = null

// Matches the Popup transition duration used by <Notify />.
const POPUP_TRANSITION_DURATION = 0

function notify() {
  listeners.forEach((listener) => listener())
}

function clearTimers() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  if (removeTimer) {
    clearTimeout(removeTimer)
    removeTimer = null
  }
}

function generateId(): string {
  return `lu-notify-${++idSeed}`
}

function mergeOptions(options: NotifyOptions): NotifyState {
  return {
    ...extend({}, defaultOptions, currentOptions, options),
    id: generateId(),
    closing: false,
  }
}

function startClose() {
  if (!state || state.closing) return

  clearTimers()
  state = { ...state, closing: true }
  notify()

  removeTimer = setTimeout(() => {
    state = undefined
    notify()
  }, POPUP_TRANSITION_DURATION * 1000)
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getNotifyState(): NotifyState | undefined {
  return state
}

export function showNotify(options: string | NotifyOptions = {}): string {
  const parsed: NotifyOptions =
    typeof options === 'string' ? { message: options } : options

  clearTimers()
  state = mergeOptions(parsed)
  notify()

  const duration = state.duration ?? 3000
  if (duration > 0) {
    closeTimer = setTimeout(() => {
      startClose()
    }, duration)
  }

  return state.id
}

export function closeNotify(): void {
  startClose()
}

export function setNotifyDefaultOptions(options: NotifyOptions): void {
  extend(currentOptions, options)
}

export function resetNotifyDefaultOptions(): void {
  currentOptions = extend({}, defaultOptions)
}

/** Reset internal state. Intended for tests only. */
export function resetNotifyState(): void {
  clearTimers()
  state = undefined
  idSeed = 0
  notify()
}
