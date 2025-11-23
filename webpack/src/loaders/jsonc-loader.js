
/**
 * jsonc-loader
 * 自动移除jsonc文件中的注释，并返回有效的JSON字符串
 *
 * @param {string} source content
 * @returns return code
 */
function jsoncLoader(source) {
  console.log('jsonc-loader')
  console.log(this.query)
  // 移除多行注释 /* */
  let cleanSource = source.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 移除单行注释 //
  cleanSource = cleanSource.replace(/\/\/.*$/gm, '');
  
  try {
    // 解析为JSON对象以验证格式正确性
    const jsonObj = JSON.parse(cleanSource);
    // 返回有效的JSON字符串
    return `module.exports = ${JSON.stringify(jsonObj)};`;
  } catch (error) {
    console.error('JSON解析错误:', error);
    throw new Error('无效的JSON格式');
  }
}

module.exports = jsoncLoader;
