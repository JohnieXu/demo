import type { ToastQueueItem, ToastOptions, ToastType } from './types'

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

const defaultOptions: ToastOptions = {
  type: 'text',
  message: '',
  position: 'middle',
  duration: 2000,
  overlay: false,
  closeOnClickOverlay: false,
  closeOnClick: false,
  forbidClick: false,
  zIndex: 400,
  className: '',
}

let queue: ToastQueueItem[] = []
let allowMultiple = false
let currentOptions: ToastOptions = extend({}, defaultOptions)
const defaultOptionsMap = new Map<ToastType, ToastOptions>()
let idSeed = 0
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

function generateId(): string {
  return `lu-toast-${++idSeed}`
}

function mergeOptions(options: ToastOptions): ToastQueueItem {
  const type = options.type ?? currentOptions.type ?? 'text'
  return {
    ...extend(
      {},
      defaultOptions,
      currentOptions,
      defaultOptionsMap.get(type),
      options,
    ),
    id: generateId(),
    closing: false,
  }
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getQueue(): readonly ToastQueueItem[] {
  return queue
}

export function showToast(options: string | ToastOptions = {}): string {
  const parsedOptions: ToastOptions = typeof options === 'string' ? { message: options } : options
  const item = mergeOptions(parsedOptions)

  if (!allowMultiple) {
    // Mark every existing toast as closing; the new one will replace them visually.
    queue = queue.map((toast) => ({ ...toast, closing: true }))
  }

  queue = [...queue, item]
  notify()
  return item.id
}

const createMethod = (type: ToastType) => (options: string | ToastOptions = {}) =>
  showToast({ ...parseOptions(options), type })

function parseOptions(options: string | ToastOptions): ToastOptions {
  return typeof options === 'string' ? { message: options } : options
}

export const showLoadingToast = createMethod('loading')
export const showSuccessToast = createMethod('success')
export const showFailToast = createMethod('fail')

export function closeToast(all?: boolean): void {
  if (!queue.length) return

  if (all) {
    queue = queue.map((toast) => ({ ...toast, closing: true }))
  } else {
    // Close the oldest active toast.
    const index = queue.findIndex((toast) => !toast.closing)
    if (index >= 0) {
      const next = [...queue]
      next[index] = { ...next[index], closing: true }
      queue = next
    }
  }

  notify()
}

export function removeToast(id: string): void {
  queue = queue.filter((toast) => toast.id !== id)
  notify()
}

export function setToastDefaultOptions(options: ToastOptions): void {
  extend(currentOptions, options)
}

export function resetToastDefaultOptions(type?: ToastType): void {
  if (type) {
    defaultOptionsMap.delete(type)
  } else {
    currentOptions = extend({}, defaultOptions)
    defaultOptionsMap.clear()
  }
}

export function allowMultipleToast(value = true): boolean {
  allowMultiple = value
  return allowMultiple
}

/** Reset internal state. Intended for tests only. */
export function resetToastState(): void {
  queue = []
  allowMultiple = false
  currentOptions = extend({}, defaultOptions)
  defaultOptionsMap.clear()
  idSeed = 0
  notify()
}
