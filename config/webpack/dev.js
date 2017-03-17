const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const baseConfig = require('./base');

module.exports = webpackMerge(baseConfig, {

});
