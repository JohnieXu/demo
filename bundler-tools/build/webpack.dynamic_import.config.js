const path = require('path')

module.exports = {
  target: 'web',
  entry: './src/index.dynamic_import.js',
  output: {
    path: path.resolve(process.cwd(), 'dist/dynamic_import'),
    filename: '[name].bundle.js'
  },
  mode: 'none'
}