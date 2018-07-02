import webpack from 'webpack'
import merge from 'webpack-merge'
import { web as webCommon } from './webpack.common.babel.js'

const mergeStrategy = {
  entry: 'prepend',
  plugins: 'prepend',
}

const web = {
  entry: {
    'web': ['react-hot-loader/patch'],
  },
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: `'${process.env.NODE_ENV}'`,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'inline-source-map', // https://webpack.js.org/configuration/devtool/
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
    port: 9000,
  },
}

module.exports = [
  merge.strategy(mergeStrategy)(webCommon, web),
]
