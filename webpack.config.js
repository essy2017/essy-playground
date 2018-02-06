'use strict';

var webpack   = require('webpack');
var path      = require('path');

module.exports = [
  {
    resolve: {
      extensions: ['.js', '.jsx']
    },

    entry: {
      'clock'                 : path.join(__dirname, '/src/clock.js'),
      'digital-clock'         : path.join(__dirname, '/src/digital-clock.js'),
      'digital-clock-details' : path.join(__dirname, '/src/digital-clock-details.js'),
      'grid'                  : path.join(__dirname, '/src/grid.js'),
      'snowflakes'            : path.join(__dirname, '/src/snowflakes.js')
    },
    output: {
      path: path.join(__dirname, '/build/'),
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
