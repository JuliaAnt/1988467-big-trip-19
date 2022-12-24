const path = require('path');
const CopyPlagin = require('copy-webpack-plugin');
const flatpickr = require("flatpickr");

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  devServer: {
    watchFiles: ['src/**/*.js', 'public/**/*'],
  },
  devtool: 'source-map',
  plugins: [
    new CopyPlagin({
      patterns: [{ from: 'public' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: { modules: true }
          }
        ]
      }
    ]
  }
}
