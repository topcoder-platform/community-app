/**
 * Endpoint helpers for the Payload CMS compatibility API. Environment variable
 * names remain Contentful-shaped so existing SSM appvars can be reused during
 * the migration, but no provider endpoint is used as a fallback.
 */

const ALLOWED_API_HOST_SUFFIXES = [
  '.topcoder.com',
  '.topcoder-dev.com',
];
const ALLOWED_LOCAL_API_HOSTS = [
  '127.0.0.1',
  'localhost',
];

function isAllowedApiHostname(hostname) {
  const normalized = hostname.toLowerCase();
  return ALLOWED_LOCAL_API_HOSTS.includes(normalized)
    || ALLOWED_API_HOST_SUFFIXES.some(suffix => normalized.endsWith(suffix));
}

function normalizeApiHost(value, property) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${property} is required; external CMS fallbacks are disabled.`);
  }
  if (typeof value !== 'string') {
    throw new TypeError(`${property} must be a hostname string.`);
  }

  let parsed;
  try {
    parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch (error) {
    throw new TypeError(`${property} must be a valid hostname string.`);
  }

  if (parsed.username || parsed.password || parsed.search || parsed.hash
    || (parsed.pathname && parsed.pathname !== '/')) {
    throw new TypeError(`${property} must not include credentials, a path, query, or fragment.`);
  }
  if (!isAllowedApiHostname(parsed.hostname)) {
    throw new Error(`${property} must target an approved Topcoder Payload CMS host.`);
  }

  return parsed.host.toLowerCase();
}

/**
 * Resolves the compatibility API hostname for one space environment.
 *
 * @param {Object} environmentConfig The environment's API configuration.
 * @param {Boolean} preview Whether the caller needs the Preview API host.
 * @return {String} A validated hostname.
 */
export function getContentfulApiHost(environmentConfig = {}, preview) {
  const property = preview ? 'PREVIEW_API_HOST' : 'CDN_API_HOST';
  return normalizeApiHost(environmentConfig[property], property);
}

/**
 * Builds a Payload compatibility API base URL.
 *
 * @param {String} host API hostname returned by getContentfulApiHost().
 * @param {String} spaceId Legacy space identifier used by the compatibility API.
 * @param {String} environment Legacy environment name used by the compatibility API.
 * @return {String} The HTTPS base URL used by ApiService.
 */
export function getContentfulApiBaseUrl(host, spaceId, environment) {
  const safeHost = normalizeApiHost(host, 'CMS API host');
  return `https://${safeHost}/spaces/${encodeURIComponent(spaceId)}/environments/${encodeURIComponent(environment)}`;
}
