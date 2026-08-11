/**
 * Endpoint helpers shared by the server-side Contentful Delivery and Preview
 * clients. They allow selected spaces to use a Contentful-compatible host
 * without changing how other spaces are configured.
 */

const CONTENTFUL_CDN_API_HOST = 'cdn.contentful.com';
const CONTENTFUL_PREVIEW_API_HOST = 'preview.contentful.com';

/**
 * Resolves the API hostname for one Contentful space environment.
 *
 * @param {Object} environmentConfig The environment's API key and optional
 *  host configuration.
 * @param {Boolean} preview Whether the caller needs the Preview API host.
 * @return {String} A hostname suitable for both the Contentful SDK and an
 *  HTTPS URL. This is used while constructing every server-side CMS client.
 * @throws {TypeError} If a configured host is not a string.
 */
export function getContentfulApiHost(environmentConfig, preview) {
  const property = preview ? 'PREVIEW_API_HOST' : 'CDN_API_HOST';
  const fallback = preview ? CONTENTFUL_PREVIEW_API_HOST : CONTENTFUL_CDN_API_HOST;
  const configuredHost = environmentConfig[property];

  if (configuredHost === undefined || configuredHost === null || configuredHost === '') {
    return fallback;
  }
  if (typeof configuredHost !== 'string') {
    throw new TypeError(`${property} must be a hostname string.`);
  }

  return configuredHost.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
}

/**
 * Builds a Contentful-compatible API base URL for direct HTTP requests.
 *
 * @param {String} host API hostname returned by getContentfulApiHost().
 * @param {String} spaceId Contentful space identifier.
 * @param {String} environment Contentful environment name.
 * @return {String} The HTTPS base URL used by ApiService.fetch().
 * @throws {URIError} If the space identifier or environment cannot be URL
 *  encoded.
 */
export function getContentfulApiBaseUrl(host, spaceId, environment) {
  return `https://${host}/spaces/${encodeURIComponent(spaceId)}/environments/${encodeURIComponent(environment)}`;
}
