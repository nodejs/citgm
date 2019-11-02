'use strict';

// Default timeout to 10 minutes if not provided
const kDefaultTimeout = 1000 * 60 * 10;

function timeout(context, proc, next, step) {
  let hasRun = false;
  const delay = context.options.timeoutLength || kDefaultTimeout;
  // Third arg === `true` is the way to signal `finish` that this is a timeout.
  // Otherwise it acts like a "regular" callback, i.e. `(err, ret) => {}`.
  // `if (timedOut)` will overwrite `err` & `ret`, so first 2 args are ignored.
  const timeout = setTimeout(finish, delay, null, null, true);

  function finish(err, ret, timedOut) {
    if (hasRun) {
      context.emit(
        'data',
        'info',
        `${context.module.name} npm:`,
        `${step} timeout.finish called more then once`
      );
      return;
    }
    hasRun = true;

    clearTimeout(timeout);
    if (timedOut) {
      context.emit(
        'data',
        'error',
        `${context.module.name} npm:`,
        `npm-${step.toLowerCase()} Timed Out`
      );
      proc.kill();
      err = new Error(`${step} Timed Out`);
      ret = null;
    }
    return next(err, ret);
  }

  return finish;
}

module.exports = timeout;
