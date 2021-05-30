const path = require('path')
const VueLoderPlugin = require('vue-loader/lib/plugin')
const HtmlPlugin = require('html-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin').CleanWebpackPlugin

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:8].js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoderPlugin(),
    new HtmlPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new CleanPlugin()
  ]
}