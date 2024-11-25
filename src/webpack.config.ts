const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      global: require.resolve('global'),
    },
  },
};
