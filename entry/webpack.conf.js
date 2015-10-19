var webpack = require('webpack');

module.exports = {
  externals: {
    // Make sure we use Meteor package for react and react-router
    'react': 'React'
  },
  devServer: {
    // You can change this to your server IP address to access it remotely
    host: '192.168.1.99'
  },
  resolve: {
    root: __dirname + '/../modules',
    extensions: ['', '.js', '.jsx', '.json', '.css', '.scss']
  }
};
