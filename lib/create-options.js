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
  options.env['npm_config_tmp'] = context.npmConfigTmp;

  return options;
}

module.exports = createOptions;
