/**
 * Shared CSS Modules class-name generation for Babel and Webpack.
 */

/* global BigInt */

const crypto = require('crypto');
const path = require('path');

const context = path.resolve(__dirname, '..');
const base64Characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

/**
 * Encodes a digest with the historical loader-utils base64 alphabet.
 *
 * @param {Buffer} digest Binary hash digest.
 * @return {String} Encoded digest.
 */
function encodeLegacyBase64(digest) {
  let value = 0n;
  for (let index = digest.length - 1; index >= 0; index -= 1) {
    value = (value * 256n) + BigInt(digest[index]);
  }

  let encoded = '';
  while (value > 0n) {
    encoded = base64Characters[Number(value % 64n)] + encoded;
    value /= 64n;
  }
  return encoded;
}

/**
 * Generates the legacy-compatible content hash without vulnerable loaders.
 *
 * @param {String} localName Local CSS class name.
 * @param {String} filename Stylesheet filename.
 * @return {String} Encoded MD5 content identifier.
 */
function generateHash(localName, filename) {
  const relativeFilename = path.relative(context, filename).replace(/\\/g, '/');
  const digest = crypto.createHash('md5')
    .update(`${relativeFilename}+${localName}`)
    .digest();
  return encodeLegacyBase64(digest);
}

/**
 * Generates the scoped class name used by both SSR and browser bundles.
 *
 * @param {String} localName Local CSS class name.
 * @param {String} filename Stylesheet filename.
 * @return {String} Stable scoped class name.
 */
function generateScopedName(localName, filename) {
  const hash = generateHash(localName, filename);
  if (process.env.BABEL_ENV === 'production') return hash.slice(0, 6);

  const relativeFilename = path.relative(context, filename).replace(/\\/g, '/');
  const extension = path.extname(relativeFilename);
  const name = path.basename(relativeFilename, extension);
  const directory = path.dirname(relativeFilename) === '.'
    ? ''
    : `${path.dirname(relativeFilename)}/`;
  return `${directory}${name}___${localName}___${hash.slice(0, 6)}`
    .replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-')
    .replace(/^((-?[0-9])|--)/, '_$1');
}

/**
 * Reproduces the historical Jest-only naming used by react-css-modules.
 * Production and development builds use generateScopedName so browser CSS and
 * precompiled server markup remain identical.
 *
 * @param {String} localName Local CSS class name.
 * @param {String} filename Stylesheet filename.
 * @return {String} Stable Jest class name.
 */
function generateTestScopedName(localName, filename) {
  const hash = generateHash(localName, filename);
  const relativeFilename = path.relative(context, filename).replace(/\\/g, '/');
  const extension = path.extname(relativeFilename);
  const name = path.basename(relativeFilename, extension);
  const directory = path.dirname(relativeFilename) === '.'
    ? ''
    : `${path.dirname(relativeFilename)}/`;
  return `${directory}___${name}__${localName}___${hash.slice(0, 5)}`
    .replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-')
    .replace(/^((-?[0-9])|--)/, '_$1');
}

module.exports = {
  generateScopedName,
  generateTestScopedName,
};
