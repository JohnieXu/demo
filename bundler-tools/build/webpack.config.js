const path = require('path')

module.exports = {
  entry: './src/index.web.js',
  output: {
    path: path.resolve(process.cwd(), 'dist/web'),
    filename: '[name].bundle.js'
  },
  mode: 'none'
}
