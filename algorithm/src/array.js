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

/**
 * 取两数组的交集
 * @param {Array} arr1 数组1
 * @param {Array} arr2 数组2
 * @param {*} compareFn 比较函数 默认：===
 */
export const intersect = (arr1, arr2, compareFn) => {
  if (!Array.isArray(arr1)) {
    handleArgError('argument arr1 must be an Array')
  }
  if (!Array.isArray(arr2)) {
    handleArgError('argument arr2 must be an Array')
  }
  if (typeof compareFn !== 'undefined' && typeof compareFn !== 'function') {
    handleArgError('argument compareFn must be undefined or Function')
  }
  const intersectedArr = arr1.filter((item1) => {
    return arr2.some((item2) => {
      if (typeof compareFn === 'function') {
        return Boolean(compareFn(item1, item2))
      }
      return item2 === item1
    })
  })
  return intersectedArr
}

/**
 * 取两数组的并集
 * @param {Array} arr1 数组1
 * @param {Array} arr2 数组2
 * @param {*} compareFn 比较函数 默认：===
 */
export const join = (arr1, arr2, compareFn) => {
  if (!Array.isArray(arr1)) {
    handleArgError('argument arr1 must be an Array')
  }
  if (!Array.isArray(arr2)) {
    handleArgError('argument arr2 must be an Array')
  }
  if (typeof compareFn !== 'undefined' && typeof compareFn !== 'function') {
    handleArgError('argument compareFn must be undefined or Function')
  }
  const uniqueArr = arr1.filter((item1) => {
    return arr2.every((item2) => {
      if (typeof compareFn === 'function') {
        return Boolean(compareFn(item1, item2))
      }
      return item2 !== item1
    })
  })
  return arr2.concat(uniqueArr)
}