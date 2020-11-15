const path = require('path')

module.exports = {
  target: 'node',
  entry: './src/index.dynamic_import.node.js',
  output: {
    path: path.resolve(process.cwd(), 'dist/dynamic_import.node'),
    filename: '[name].bundle.js'
  },
  mode: 'none'
}