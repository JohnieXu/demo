const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge')
const htmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.js');

module.exports = merge(baseConfig, {
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    }),
  ]
})
