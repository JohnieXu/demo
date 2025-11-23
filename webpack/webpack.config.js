const path = require('path');
const webpack = require('webpack');
// const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: {
    index: './src/base/index.js',
    search: './src/base/search.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      // {
      //   test: /\.vue$/,
      //   loader: 'vue-loader'
      // }
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
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 10
            }
          }
        ]
      },
      {
        test: /\.jsonc$/,
        use: [
          {
            loader: path.resolve(__dirname, 'src/loaders/jsonc-loader.js'),
            options: {
              aaa: 'bbb',
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new VueLoaderPlugin()
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    alias: {
      core: path.resolve(__dirname, "src/core")
    }
  },
  optimization: {
    // https://webpack.js.org/plugins/split-chunks-plugin/
    // splitChunks: 
  }
}
