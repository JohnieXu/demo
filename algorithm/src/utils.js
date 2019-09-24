/**
 * 函数错误处理
 * @param {String} info 错误描述
 */
export const handleArgError = (info = '') => {
  throw new Error(info)
}
/**
 * 节流(限制事件执行频率)
 * 高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率
 * @param {Function} fn 需要节流处理的函数
 * @param {Number} delay 延时时间 默认：300ms
 */
export const throttle = (fn, delay = 300) => {
  let locked = false // 状态锁
  return (...props) => {
    if (locked) { return }
    locked = true
    setTimeout(function timeout() {
      locked = false
      typeof fn === 'function' && fn.call(this, ...props)
    }, delay)
  }
}

/**
 * 防抖(延迟一定时间之后执行)
 * 触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间
 * @param {Function} fn 需要防抖处理的函数
 * @param {Number} delay 延时时间 默认：300ms
 */
export const debounce = (fn, delay = 300) => {
  let timer // 当前延时的定时器
  return (...props) => {
    timer && clearTimeout(timer)
    timer = setTimeout(function timeout() {
      typeof fn === 'function' && fn.call(this, ...props)
    }, delay);
  }
}

export const shallowClone = (obj) => {
  // number string boolean null undefined
}

export const deepClone = (obj) => {}
