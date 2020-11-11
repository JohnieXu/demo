const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].node.bundle.js'
  },
  mode: 'none',
  target: 'node'
}
