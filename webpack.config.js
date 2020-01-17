const allEnvConfigs = require( './webpack_configs/index.js' );

const DEFAULT_ENV = 'dev';

module.exports = function( cliEnv ) {
  let cliEnvConfig = allEnvConfigs[ cliEnv ];

  if( !cliEnvConfig ) {
    let avaibleEnvs = Object.keys( allEnvConfigs ).join(' ');
    console.warn(`
      Provided environment "${cliEnv}" was not found.
      Please use one of the following ones: ${avaibleEnvs}
    `);
  }

  return cliEnvConfig || allEnvConfigs[ DEFAULT_ENV ];
}
