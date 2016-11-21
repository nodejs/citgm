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
  var nodeGypBinary = process.platform === 'win32' ?
    path.resolve(path.dirname(npmLocation), 'node_modules', 'npm', 'node_modules',
                 'node-gyp', 'bin', 'node-gyp.js') :
    path.resolve(path.dirname(npmLocation), '..', 'lib', 'node_modules', 'npm',
                 'node_modules', 'node-gyp', 'bin', 'node-gyp.js');
  var script = '#!/usr/bin/env node\n' +
               'var args = process.argv.slice(1);\n' +
               'if (args.indexOf(\'build\') != -1 || args.indexOf(\'rebuild\') != -1) {\n' +
               '  require(\'fs\').writeFileSync(\'' + this.marker.replace(/\\/g, '\\\\') + '\', \'.\');\n' +
               '}\n' +
               'require(\'child_process\').fork(\'' + nodeGypBinary.replace(/\\/g, '\\\\') + '\', args)\n' +
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
