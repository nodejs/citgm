import _ from 'lodash';
import xmlSanitizer from 'xml-sanitizer';

export function getPassing(modules) {
  return _.filter(modules, (mod) => {
    return !mod.error && !mod.skipped;
  });
}

export function getSkipped(modules) {
  return _.filter(modules, (mod) => {
    return mod.skipped;
  });
}

export function getFails(modules) {
  return _.filter(modules, (mod) => {
    return mod.error && !mod.flaky && !mod.expectFail;
  });
}

export function getFlakyFails(modules) {
  return _.filter(modules, (mod) => {
    return mod.error && mod.flaky;
  });
}

export function getExpectedFails(modules) {
  return _.filter(modules, (mod) => {
    return mod.expectFail && mod.error;
  });
}

export function hasFailures(modules) {
  return _.some(modules, (mod) => {
    return mod.error && !mod.flaky;
  });
}

export function sanitizeOutput(output, delimiter, xml) {
  if (!output || output === '') return '';
  /* eslint-disable no-control-regex */
  // ([valid-range])|. matches anything but only captures valid-range
  const validUtf8 = new RegExp(
    `(${[
      /[\x09\x0A\x0D\x20-\x7E]/, // ASCII
      /[\xC2-\xDF][\x80-\xBF]/, // Non-overlong 2-byte
      /\xE0[\xA0-\xBF][\x80-\xBF]/, // Excluding overlongs
      /[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}/, // Straight 3-byte
      /\xED[\x80-\x9F][\x80-\xBF]/, // Excluding surrogates
      /\xF0[\x90-\xBF][\x80-\xBF]{2}/, // Planes 1-3
      /[\xF1-\xF3][\x80-\xBF]{3}/, // Planes 4-15
      /\xF4[\x80-\x8F][\x80-\xBF]{2}/ // Plane 16
    ]
      .map((r) => {
        return r.source;
      })
      .join('|')})|.`,
    'g'
  );
  /* eslint-enable no-control-regex */
  // $1 matches the valid-range char if captured, or '' otherwise
  // So this removes all invalid UTF-8
  return _(output.replace(validUtf8, '$1').split(/[\r\n]+/))
    .filter((item) => {
      return item.length && item !== '\n' && item !== 'undefined';
    })
    .map((item) => {
      if (xml) item = xmlSanitizer(item);
      return [delimiter, item].join(' ');
    })
    .value()
    .join('\n');
}
