const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: './src/standalone.js',
  output: {
    filename: 'monaco.min.js',
    path: path.resolve(__dirname, 'dist/standalone')
  },
  resolveLoader: {
    alias: {
      'blob-url-loader': require.resolve('./loaders/blobUrl'),
      'compile-loader': require.resolve('./loaders/compile')
    }
  },
  module: {
    rules: [
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        use: ['file-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /codicon.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: './config/'
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
}
