var path = require('path');

var config = {
  optimization: {
    minimize: true
  },
  externals: {},
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
};

var scripts = Object.assign({}, config, {
    entry: "./_dev/js/app.js",
    output: {
       path: path.resolve(__dirname, './dist/js'),
       filename: "app.js"
    },
});

module.exports = [
    scripts,
];
