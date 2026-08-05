/* global atob document */

const _ = require('lodash');

function parseCookie(cookie) {
  return _.fromPairs(cookie
    .split(';')
    .map(pair => pair.split('=').map(part => part.trim())));
}

function readCookie(name) {
  return parseCookie(document.cookie)[name];
}

/**
 * Gets a browser cookie by name.
 *
 * @param {String} key Cookie name.
 * @return {String|undefined} Cookie value.
 */
function getToken(key) {
  return readCookie(key);
}

function decodeBase64Url(value) {
  let encoded = value.replace(/-/g, '+').replace(/_/g, '/');

  switch (encoded.length % 4) {
    case 0:
      break;
    case 2:
      encoded += '==';
      break;
    case 3:
      encoded += '=';
      break;
    default:
      throw new Error('Illegal base64url string');
  }

  const binary = atob(encoded);
  const escaped = Array.from(
    binary,
    character => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`,
  ).join('');

  return decodeURIComponent(escaped);
}

/**
 * Decodes a JWT payload without attempting signature validation.
 *
 * @param {String} token Encoded JWT.
 * @return {Object} Decoded JWT payload with canonical Topcoder claims.
 */
function decodeToken(token) {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('The token is invalid');
  }

  const decoded = decodeBase64Url(parts[1]);

  if (!decoded) {
    throw new Error('Cannot decode the token');
  }

  const payload = JSON.parse(decoded);

  payload.userId = _.parseInt(_.find(
    payload,
    (value, key) => key.includes('userId'),
  ));
  payload.handle = _.find(
    payload,
    (value, key) => key.includes('handle'),
  );
  payload.roles = _.find(
    payload,
    (value, key) => key.includes('roles'),
  );

  return payload;
}

function getTokenExpirationDate(token) {
  const decoded = decodeToken(token);

  if (typeof decoded.exp === 'undefined') {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(decoded.exp);
  return date;
}

/**
 * Determines whether a JWT is expired or inside the supplied expiry offset.
 *
 * @param {String} token Encoded JWT.
 * @param {Number} offsetSeconds Expiry offset in seconds.
 * @return {Boolean} Whether the JWT is expired.
 */
function isTokenExpired(token, offsetSeconds = 0) {
  const expiration = getTokenExpirationDate(token);

  if (expiration === null) {
    return false;
  }

  return expiration.valueOf()
    <= (new Date().valueOf() + (offsetSeconds * 1000));
}

module.exports = {
  decodeToken,
  getToken,
  isTokenExpired,
};
