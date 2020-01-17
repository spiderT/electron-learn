const devConfig = require( './webpack.dev.js' );
const prodConfig = require( './webpack.prod.js' );

module.exports = {
  dev: devConfig,
  prod: prodConfig
};