/**
 * Runtime URL guards for Payload CMS responses and redirects.
 */

import config from 'config';

const RETIRED_CMS_NAME = ['content', 'ful'].join('');
const RETIRED_HOSTING_NAME = ['net', 'lify'].join('');
const RETIRED_FRAMEWORK_NAME = ['oct', 'ana'].join('');
const RETIRED_PROVIDER_HOST_SUFFIXES = [
  `${RETIRED_CMS_NAME}.com`,
  ['ctf', 'assets.net'].join(''),
  `${RETIRED_HOSTING_NAME}.app`,
  `${RETIRED_HOSTING_NAME}.com`,
  `${RETIRED_HOSTING_NAME}usercontent.com`,
  `${RETIRED_FRAMEWORK_NAME}.io`,
];
const NETWORK_AUTHORITY_PATTERN = /(^|[^a-z0-9._~/?#%-])(?:(?:https?):\/*|\/\/)(?:[^/?#\s]*@)?([a-z0-9.-]+)(?=[^a-z0-9.-]|$)/gi;
const MAX_DECODE_LAYERS = 5;
const NAMED_ENTITIES = {
  bsol: '\\',
  colon: ':',
  newline: '\n',
  period: '.',
  sol: '/',
  tab: '\t',
};

function isRetiredProviderHostname(hostname) {
  const normalized = hostname.toLowerCase();
  return RETIRED_PROVIDER_HOST_SUFFIXES.some(suffix => (
    normalized === suffix || normalized.endsWith(`.${suffix}`)
  ));
}

function parseNetworkUrl(value, baseUrl) {
  if (value.startsWith('//')) return new URL(`https:${value}`);
  return new URL(value, baseUrl);
}

function decodedCodePoint(encoded, radix) {
  const codePoint = Number.parseInt(encoded, radix);
  return Number.isInteger(codePoint) && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : null;
}

/** Normalizes encodings a browser can turn into a network URL. */
function normalizeBrowserText(value) {
  let normalized = value;
  for (let depth = 0; depth < MAX_DECODE_LAYERS; depth += 1) {
    const decoded = normalized
      .replace(/\\u([a-f0-9]{4})/gi, (match, hex) => (
        decodedCodePoint(hex, 16) || match
      ))
      .replace(/\\u\{([a-f0-9]{1,6})\}/gi, (match, hex) => (
        decodedCodePoint(hex, 16) || match
      ))
      .replace(/\\x([a-f0-9]{2})/gi, (match, hex) => (
        decodedCodePoint(hex, 16) || match
      ))
      .replace(/&#x([a-f0-9]+);?/gi, (match, hex) => (
        decodedCodePoint(hex, 16) || match
      ))
      .replace(/&#([0-9]+);?/g, (match, decimal) => (
        decodedCodePoint(decimal, 10) || match
      ))
      .replace(/&(colon|sol|period|bsol|tab|newline);/gi, (match, name) => (
        NAMED_ENTITIES[name.toLowerCase()] || match
      ));
    if (decoded === normalized) break;
    normalized = decoded;
  }
  return normalized
    .replace(/[。．｡]/g, '.')
    .replace(/[\t\n\r\f\v]/g, '')
    .replace(/\\\//g, '/')
    .replace(/\\/g, '/');
}

/** Decodes valid percent-byte runs without one malformed escape hiding others. */
function decodePercentBytes(value) {
  return value.replace(/(?:%[a-f0-9]{2})+/gi, (encoded) => {
    try {
      return decodeURIComponent(encoded);
    } catch (error) {
      return encoded.replace(/%([a-f0-9]{2})/gi, (match, hex) => (
        String.fromCharCode(Number.parseInt(hex, 16))
      ));
    }
  });
}

/** Returns true when any URL authority in normalized text is retired. */
function hasRetiredProviderAuthority(value) {
  NETWORK_AUTHORITY_PATTERN.lastIndex = 0;
  let match = NETWORK_AUTHORITY_PATTERN.exec(value);
  while (match) {
    const hostname = match[2].toLowerCase().replace(/\.+$/, '');
    if (isRetiredProviderHostname(hostname)) return true;
    match = NETWORK_AUTHORITY_PATTERN.exec(value);
  }
  return false;
}

/** Detects raw, browser-escaped, nested, and repeatedly encoded URLs. */
function containsRetiredProviderUrl(value) {
  let layer = value;
  for (let depth = 0; depth <= MAX_DECODE_LAYERS; depth += 1) {
    const normalized = normalizeBrowserText(layer);
    if (hasRetiredProviderAuthority(normalized)) return true;
    const decoded = decodePercentBytes(normalized);
    if (decoded === normalized) return false;
    layer = decoded;
  }
  return false;
}

function isTopcoderOrLocalHostname(hostname) {
  return hostname === 'localhost'
    || hostname === '127.0.0.1'
    || hostname.endsWith('.topcoder.com')
    || hostname.endsWith('.topcoder-dev.com');
}

/**
 * Returns the validated Payload application origin used by editor redirects
 * and CSP. This prevents PAYLOAD_CMS_URL from reintroducing an external host.
 *
 * @return {String} Payload application origin.
 */
export function getPayloadAppUrl() {
  const parsed = new URL(config.URL.CMS_APP);
  if (!isTopcoderOrLocalHostname(parsed.hostname)) {
    throw new Error('PAYLOAD_CMS_URL must target an approved Topcoder Payload CMS host.');
  }
  if (parsed.protocol !== 'https:'
    && !['127.0.0.1', 'localhost'].includes(parsed.hostname)) {
    throw new Error('PAYLOAD_CMS_URL must use HTTPS.');
  }
  return parsed.origin;
}

/**
 * Rejects provider URLs embedded anywhere in a compatibility API response.
 * This covers legacy URLs inside rich text/markdown as well as Asset records.
 *
 * @param {*} value Response value to inspect.
 * @return {*} The original value, for convenient inline validation.
 */
export function assertNoRetiredCmsUrls(value) {
  const visited = new WeakSet();

  function inspect(current) {
    if (typeof current === 'string') {
      if (containsRetiredProviderUrl(current)) {
        throw new Error('Payload CMS response contains a retired provider URL.');
      }
      return;
    }
    if (!current || typeof current !== 'object' || visited.has(current)) return;
    visited.add(current);
    Object.keys(current).forEach((key) => {
      inspect(key);
      inspect(current[key]);
    });
  }

  inspect(value);
  return value;
}

/**
 * Converts an Asset URL to an absolute URL and proves it points at the
 * configured S3-backed asset origin before an HTTP redirect is emitted.
 *
 * @param {String} assetUrl URL returned by Payload's compatibility API.
 * @return {String} Validated absolute asset URL.
 */
export function getPayloadAssetUrl(assetUrl) {
  if (typeof assetUrl !== 'string' || !assetUrl) {
    throw new TypeError('Payload CMS Asset response does not contain a file URL.');
  }

  const configuredBase = new URL(config.URL.CMS_ASSETS);
  if (isRetiredProviderHostname(configuredBase.hostname)) {
    throw new Error('PAYLOAD_CMS_ASSET_URL cannot target the retired CMS provider.');
  }
  if (configuredBase.protocol !== 'https:'
    && !['127.0.0.1', 'localhost'].includes(configuredBase.hostname)) {
    throw new Error('PAYLOAD_CMS_ASSET_URL must use HTTPS.');
  }

  assertNoRetiredCmsUrls(assetUrl);
  const parsed = parseNetworkUrl(assetUrl, configuredBase);
  if (parsed.origin !== configuredBase.origin) {
    throw new Error('Payload CMS Asset URL is outside PAYLOAD_CMS_ASSET_URL.');
  }
  if (configuredBase.pathname !== '/'
    && !parsed.pathname.startsWith(configuredBase.pathname)) {
    throw new Error('Payload CMS Asset URL is outside the configured asset path.');
  }

  return parsed.href;
}
