import path from 'path'
import { BannerPlugin } from 'webpack'
import merge from 'webpack-merge'
import { web as webCommon } from './webpack.common.babel.js'

const mergeStrategy = {
  plugins: 'prepend',
}

const web = {
  optimization: {
    nodeEnv: false,
    noEmitOnErrors: false,
    minimize: true,
  },
  devtool: 'source-map', // https://webpack.js.org/configuration/devtool/
}

export const server = {
  entry: {
    'server': './bin/server.js',
  },
  target: 'node',
  externals: {
    yamlparser: 'yamlparser',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.join(__dirname, '/dist/server'),
    publicPath: '/',
    filename: '[name].js',
  },
  plugins: [
    new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
  ],
  mode: 'none', // https://webpack.js.org/concepts/mode/#mode-none
  optimization: {
    nodeEnv: false,
    noEmitOnErrors: false,
    minimize: true,
  },
  devtool: 'source-map',
}

module.exports = [
  merge.strategy(mergeStrategy)(webCommon, web),
  server,
]
