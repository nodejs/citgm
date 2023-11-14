import chalk from 'chalk';

import * as util from './util.js';

const outChunkSize = 10000;

function logModule(log, logType, module) {
  log[logType](chalk.yellow('module name:'), module.name);
  if (!module.skipped) {
    log[logType](chalk.yellow('version:'), module.version);

    if (module.sha) log[logType](chalk.yellow('sha:'), module.sha);
  }
  if (module.error) {
    if (!module.testOutput) module.testOutput = '';
    log[logType]('error:', module.error.message);
    // If the output is not too big, just print it.
    if (module.testOutput.length < outChunkSize) {
      log[logType]('error:', module.testOutput);
      return;
    }
    // If the output is too big the log formatter explodes, so we slice.
    for (let i = 0; i < module.testOutput.length; ) {
      // Slice the output to `outChunkSize` size chunks,
      // from `i` to `i + outChunkSize`, and update `i`.
      const rawChunk = module.testOutput.substring(i, (i += outChunkSize));
      // Align chunk to the last EOL:
      // 1. Search for last EOL.
      const lastEOL = rawChunk.lastIndexOf('\n') + 1;
      // 2.1. If EOL found, trim the chunk of what comes after `lastEOL`.
      const chunk = lastEOL > 0 ? rawChunk.substring(0, lastEOL) : rawChunk;
      // 2.2. And push back `i` to `lastEOL`, but relative to original size.
      if (lastEOL > 0) {
        const eolDistanceFromEndOfChunk = outChunkSize - lastEOL;
        i -= eolDistanceFromEndOfChunk;
      }
      log[logType]('error:', chunk);
    }
  }
}

function logModules(log, logType, modules) {
  modules.forEach((module) => logModule(log, logType, module));
}

export default function logger(log, modules) {
  if (!(modules instanceof Array)) {
    modules = [modules];
  }
  const passed = util.getPassing(modules);
  const skipped = util.getSkipped(modules);
  const flaky = util.getFlakyFails(modules);
  const failed = util.getFails(modules);
  const expectFail = util.getExpectedFails(modules);

  if (passed.length > 0) {
    log.info('passing module(s)');
    logModules(log, 'info', passed);
  }
  if (skipped.length > 0) {
    log.info('skipped module(s)');
    logModules(log, 'info', skipped);
  }
  if (expectFail.length > 0) {
    log.info('expected to fail:');
    logModules(log, 'error', expectFail);
  }
  if (flaky.length > 0) {
    log.warn('flaky module(s)');
    logModules(log, 'warn', flaky);
  }
  if (failed.length > 0) {
    log.error('failing module(s)');
    logModules(log, 'error', failed);
    log.error('done', 'The smoke test has failed.');
  } else {
    log.info('done', 'The smoke test has passed.');
  }
}
