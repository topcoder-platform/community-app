/**
 * Runtime URL guards for Payload CMS responses and redirects.
 */

import config from 'config';

const RETIRED_PROVIDER_HOST_SUFFIXES = [
  'contentful.com',
  'ctfassets.net',
  'netlify.app',
  'netlify.com',
  'netlifyusercontent.com',
  'octana.io',
];
const URL_PATTERN = /(?:https?:)?\/\/[^\s<>"')\]]+/gi;

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
      const matches = current.match(URL_PATTERN) || [];
      matches.forEach((match) => {
        let parsed;
        try {
          parsed = parseNetworkUrl(match, 'https://localhost');
        } catch (error) {
          return;
        }
        if (isRetiredProviderHostname(parsed.hostname)) {
          throw new Error('Payload CMS response contains a retired provider URL.');
        }
      });
      return;
    }
    if (!current || typeof current !== 'object' || visited.has(current)) return;
    visited.add(current);
    Object.keys(current).forEach(key => inspect(current[key]));
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
