import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// extract-text-webpack-plugin DEPRECATED https://git.io/vxW5J
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const extractCSS = new ExtractTextPlugin('dist/styles.css')
const extractGlobalCSS = new ExtractTextPlugin('dist/global.css')

export const web = {
  entry: {
    'web': ['babel-polyfill', './src/index.js'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: extractCSS.extract({
          use: [
            { loader: 'css-loader', options: { modules: true, importLoaders: 1 } },
            { loader: 'postcss-loader' },
          ],
        }),
      },
      // css files from node_module should already be transform to CSS3 syntax
      {
        test: /\.css$/,
        include: [/node_modules/],
        use: extractGlobalCSS.extract({
          use: [
            { loader: 'css-loader', options: { modules: false } },
          ],
        }),
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[hash].[ext]',
          },
        },
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'svg-inline-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '$src': path.resolve(__dirname, 'src'),
      '$config': path.resolve(__dirname, 'config'),
    },
  },
  output: {
    path: path.join(__dirname, '/dist/web'),
    publicPath: '/',
    filename: '[name].js',
  },
  plugins: [
    extractCSS,
    extractGlobalCSS,
    new HtmlWebpackPlugin({
      hash: true,
      title: 'tlv-next',
      template: './src/index.html',
      favicon: './src/assets/icons/favicon.ico',
    }),
  ],
  mode: 'none', // https://webpack.js.org/concepts/mode/#mode-none
}
