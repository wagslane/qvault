const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  target: 'electron-main',
  entry: {
    qvault: './src/qvault.es6'
  },
  output: {
    filename: './[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.svg$/,
        loader: 'vue-svg-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?.*)?$/,
        use: [
          'url-loader?name=assets/[name].[ext]',
        ]
      },
      {
        test: /\.less/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin()
  ],
  devtool: 'source-map',
  mode: 'development'
};
