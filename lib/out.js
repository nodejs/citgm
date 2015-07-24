
var chalk = require('chalk');
var columnify = require('columnify');
var supportsColor = require('supports-color');
var flat = require('flat');

var _info = {
  label: chalk.cyan,
  tag: chalk.green,
  message: chalk.white
};
var _warn = {
  label: chalk.yellow,
  tag: chalk.green,
  message: chalk.white
};
var _err = {
  label: chalk.red,
  tag: chalk.red,
  message: chalk.white
};

function show(label,scheme,tag,message) {
  var line = {
    a:label,
    b:tag,
    c:''
  };
  if (typeof message !== 'object')
    line.c = message;
  if (supportsColor) {
    line.a = scheme.label(line.a);
    line.b = scheme.tag(line.b);
    line.c = scheme.message(line.c);
  }
  console.log(columnify([line], {
    showHeaders: false,
    maxLineWidth: 'auto',
    minWidth: 20,
    maxWidth: 53,
    columnSplitter: '|',
    config: {
      a: { maxWidth: 7 }
    },
    preserveNewLines: true
  }));
  if (typeof message === 'object') {
    console.log(
      columnify(
        flat(message, {
          maxDepth: 100,
          safe: true}),
        {
          showHeaders:false,
          maxLineWidth: 'auto',
          minWidth: 10,
          maxWidth: 40,
          dataTransform: function(data) {
            if (data === '[object Object]')
              return '{none}';
            else return data;
          }
        }
      )
    );
    console.log();
  }
}

exports.info = show.bind(null,'Info',_info);
exports.warn = show.bind(null,'Warn',_warn);
exports.error = show.bind(null,'Error',_err);
