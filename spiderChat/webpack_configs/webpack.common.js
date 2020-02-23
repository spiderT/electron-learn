const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AbsulotePath = require('./absulotePath');

var appConfig = {
  entry: {
    app: [
      'babel-polyfill',
      './src/index.js'
    ]
  },
  plugins: [
    // new CleanWebpackPlugin( ['dist'], {
    //   root: AbsulotePath.root,
    //   exclude: [],
    //   verbose: true,
    //   dry: false
    // } ),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: "styles/[name].[hash:8].css"
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {

        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          reuseExistingChunk: true
        }
      }
    }
  },
  // target: 'electron-renderer',
  output: {
    filename: 'scripts/[name].[hash:8].js',
    path: AbsulotePath.filedist
  },
  module: {
    rules: [{
      test: /.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: [
          ['env', { "modules": false }],
          "stage-2",
          'react'
        ],
        plugins: [
          "transform-decorators-legacy",
          ["import", { "libraryName": "antd", "style": "css" }]
        ]
      }
    },
    {
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { importLoaders: 1 }
        },
        'postcss-loader'
      ]
    }, {
      test: /.(png|svg|jpg|jpeg|gif)$/,
      loader: 'file-loader',
      options: {
        esModule: false, // 这里设置为false
        name: '[name].[ext]',
        publicPath: '/images/',
        outputPath: 'images/'
      }
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        publicPath: '../iconfont/',
        outputPath: 'iconfont/'
      }
    }]
  }
};

module.exports = appConfig;