const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: './src/app.es6',
  output: {
    filename: './app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },{
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
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
