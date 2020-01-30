const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: path.join(__dirname, 'src/app.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html')
    }),
  ],
}

!isProduction && config.plugins.push(new webpack.HotModuleReplacementPlugin())

module.exports = config
