const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    background: './src/js/background.js',
    content: './src/js/content.js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'sass-loader'
      }]
    }]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'src/manifest.json'
    }, {
      from: 'src/images/*',
      to: 'images/',
      flatten: true
    }])
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production',
  watch: true,
  performance: {
    hints: false
  }
}
