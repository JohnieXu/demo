import { handleArgError } from './utils'

/**
 * 扁平化数组
 * @param {Array} arr 需要扁平化的数组
 */
export const flatten = (arr) => {
  if (!Array.isArray(arr)) {
    return handleArgError('argument `arr` must be an array')
  }
  const set = new Set()
  const flat = (item) => {
    if (typeof item === 'undefined') { return }
    if (!Array.isArray(item)) {
      set.add(item)
    } else {
      item.forEach(item => flat(item))
    }
  }
  arr.forEach(item => flat(item))
  return [...set]
}