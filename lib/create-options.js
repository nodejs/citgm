var _ = require('lodash');
function createOptions(cwd, context) {
  var options = {
    cwd: cwd
  };
  if (!(process.platform === 'win32')) {
    if (context.options.uid) options.uid = context.options.uid;
    if (context.options.gid) options.gid = context.options.gid;
  }
  options.env = Object.create(process.env);
  options.env['npm_loglevel'] = 'error';
  // Use a local temp directory for npm if not already set via the env variable
  if (!options.env['npm_config_tmp']) {
    options.env['npm_config_tmp'] = context.npmConfigTmp;
  }

  if (context.module && context.module.envVar) {
    _.forEach(context.module.envVar, function (val, key) {
      options.env[key] = val;
    });
  }
  return options;
}

module.exports = createOptions;
