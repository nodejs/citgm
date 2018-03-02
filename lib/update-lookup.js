'use strict';
const fs = require('fs');

// If got up to here then npm test passed
// If `--ulkgr` option passed then update lookup

function update(context, next) {

  if (context.options.ulkgr) {
    const details = context.module;

    context.emit('data', 'info', 'update-lookup', 'true');
    context.emit('data', 'info', 'update-lookup',
    'npm: ' + details.version + ' lookup: ' + details.lkgr);

    if (details.version !== details.lkgr) {
      context.emit('data', 'info', 'update-lookup', 'updating');
      var lookup = JSON.parse(fs.readFileSync(__dirname + '/lookup.json', 'utf8'));

      lookup[details.name].lkgr = details.version;

      let lookupString = JSON.stringify(lookup, (k,v) => {
         if(v instanceof Array) {
            return JSON.stringify(v)
            .replace(/,/g, ', ');
         }
         return v;
      },2)// regex to remove line breaks and tabs inside arrays.
        .replace(/\\/g, '')
        .replace(/\"\[/g, '[')
        .replace(/\]\"/g,']')

      fs.writeFileSync(__dirname + '/lookup.json', lookupString, 'utf8');

    } else {
      context.emit('data', 'info', 'update-lookup', 'lookup is already up to date');
    }
  } else {
    context.emit('data', 'info', 'update-lookup', 'false');
  }

  next(null, context);

}

module.exports = update;
