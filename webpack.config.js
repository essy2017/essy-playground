'use strict';

var webpack   = require('webpack');
var path      = require('path');

module.exports = [
  {
    resolve: {
      extensions: ['.js', '.jsx']
    },

    entry: {
      snowflakes: path.join(__dirname, '/src/snowflakes.js')
    },
    output: {
      path: __dirname,
      filename: 'bundle-[name].js'
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: ['node_modules'],
          use: [
            'babel-loader'
          ]
        }
      ]
    },

    stats: {
      colors: true
    }
  }
];
