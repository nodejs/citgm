'use strict';
var uuid = require('node-uuid');
var path = require('path');
var fs = require('fs');
var which = require('which').sync;

function VerifyNodeGyp(context) {
  if (!(this instanceof VerifyNodeGyp))
    return new VerifyNodeGyp(context);
  this.verifyNodeGyp = context.module.verifyNodeGyp;
  var id = uuid.v4();
  var scriptFilename = id + '.js';
  this.script = path.resolve(context.path, scriptFilename);
  this.marker = path.resolve(context.path, id + '.tmp');

  var npmLocation = which('npm');
  var npmNodeGyp = process.platform === 'win32' ?
    path.resolve(path.dirname(npmLocation), 'node_modules', 'npm', 'bin', 'node-gyp-bin', 'node-gyp.cmd') :
    path.resolve(path.dirname(npmLocation), '..', 'lib', 'node_modules', 'npm', 'bin', 'node-gyp-bin', 'node-gyp');
  var script = '#!/usr/bin/env node\n' +
               'var args = process.argv.slice(1);\n' +
               'if (args.indexOf(\'build\') != -1 || args.indexOf(\'rebuild\') != -1) {\n' +
               '  require(\'fs\').writeFileSync(\'' + this.marker.replace(/\\/g, '\\\\') + '\', \'.\');\n' +
               '}\n' +
               'var npmNodeGyp = \'' + npmNodeGyp.replace(/\\/g, '\\\\') + '\';\n';
  if (process.env['npm_config_node_gyp']) {
    script += 'var useEnv = process.env;\n';
    script += 'useEnv[\'npm_config_node_gyp\'] = \'' + process.env['npm_config_node_gyp'].replace(/\\/g, '\\\\') + '\';\n';
  } else {
    script += 'var useEnv = process.env;\n';
    script += 'delete useEnv[\'npm_config_node_gyp\'];\n';
  }
  script += 'require(\'child_process\').spawn(npmNodeGyp, args, { shell: true, env: useEnv })\n' +
            '  .on(\'close\', function(code) { process.exit(code); });\n';
  fs.writeFileSync(this.script, script, {mode: parseInt('777', 8)});
}

VerifyNodeGyp.prototype.setOptions = function(options) {
  options.env['npm_config_node_gyp'] = this.script;
};

VerifyNodeGyp.prototype.wasCalled = function() {
  return fs.existsSync(this.marker);
};

module.exports = VerifyNodeGyp;
