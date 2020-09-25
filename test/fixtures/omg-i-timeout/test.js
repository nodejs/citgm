'use strict';

const { join } = require('path');
const { spawn } = require('child_process');
const { tmpdir } = require('os');
const { closeSync, open, write } = require('fs');

if (process.argv[2] === 'child') {
  const file = join(tmpdir(), 'omg-i-timeout-tmpfile');
  open(file, 'w', (err, fd) => {
    if (!err) {
      write(fd, 'first write', (err) => {
        if (!err) {
          setTimeout(() => {
            write(fd, 'second write', () => {
              closeSync(fd);
            });
          }, 60 * 1000);
        }
      });
    }
  });
  return;
}

const p = spawn(process.execPath, [__filename, 'child']);
p.on('end', () => {
  console.log('end');
});
