// utils
const merge = require( 'webpack-merge' );
// configs
const commons = require( './webpack.common.js' );

/* --------------------------- main ---------------------------- */
module.exports = [ merge( commons, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './build',
      disableHostCheck: true,
      port: 9200
    }
  } )
];