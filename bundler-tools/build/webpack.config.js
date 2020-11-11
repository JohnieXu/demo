const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].bundle.js'
  },
  mode: 'none'
}
