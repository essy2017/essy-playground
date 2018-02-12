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
      'color-wheel'           : path.join(__dirname, '/src/color-wheel.js'),
      'colors'                : path.join(__dirname, '/src/colors.js'),
      'digital-clock'         : path.join(__dirname, '/src/digital-clock.js'),
      'digital-clock-details' : path.join(__dirname, '/src/digital-clock-details.js'),
      'grid'                  : path.join(__dirname, '/src/grid.js'),
      'pixelate'              : path.join(__dirname, '/src/pixelate.js'),
      'scales'                : path.join(__dirname, '/src/scales.js'),
      'snowflakes'            : path.join(__dirname, '/src/snowflakes.js'),
      'sparklines'            : path.join(__dirname, '/src/sparklines.js')
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
