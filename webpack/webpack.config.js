const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniExtractCssWebpackPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ProgressOraPlugin = require('webpack-progress-ora-plugin')
const VersinoFile = require('webpack-version-file')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [{
          loader: MiniExtractCssWebpackPlugin.loader
        },{
          loader: 'css-loader',
          options: {
            modules: 'local'
          }
        }],
      },
    ],
  },
  plugins: [
    new ProgressOraPlugin(),
    new CleanWebpackPlugin({
      verbose: true
    }),
    new HtmlWebpackPlugin(),
    new MiniExtractCssWebpackPlugin({
      name: '[name].[hash].css',
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(new Date().getMinutes())
    }),
    new VersinoFile()
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 9010
  }
};
