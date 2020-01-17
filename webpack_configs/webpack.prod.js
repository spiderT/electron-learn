// utils
const webpack = require( 'webpack' );
const merge = require( 'webpack-merge' );
// plugins
const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' );
// configs
const commons = require( './webpack.common.js' );
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/* --------------------------- main ---------------------------- */
module.exports = [ merge( commons, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
      new UglifyJSPlugin( {
        sourceMap: true
      } ),
      new webpack.DefinePlugin( {
        'process.env.NODE_ENV': JSON.stringify( 'production' )
      } )
    ]
  } )
];