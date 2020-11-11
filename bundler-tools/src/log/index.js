/**
 * 打印报错提示
 * @param {string} text 内容
 */
export const warn = (text) => {
  if (!text) {
    console.log('\n')
  } else {
    console.log('[bundler-tools WARN]: ' + text)
  }
}
