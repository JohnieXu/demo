const path = require('path')

module.exports = {
  entry: './src/index.node.js',
  output: {
    path: path.resolve(process.cwd(), 'dist/node'),
    filename: '[name].bundle.js'
  },
  mode: 'none',
  target: 'node'
}
