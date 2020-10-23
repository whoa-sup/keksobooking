const path = require('path');

module.exports = {
  entry: [
    './js/card.js',
    './js/data.js',
    './js/filter.js',
    './js/form.js',
    './js/main.js',
    './js/message.js',
    './js/pins.js',
    './js/request.js',
    './js/util.js',
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname),
    iife: true,
  },
  devtool: false
};
