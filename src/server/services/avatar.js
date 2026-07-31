/**
 * A simple, one-function service that fetches specified user vatars from the TC
 * backend and returns them in the specified size.
 */

import config from 'config';
import fetch from 'isomorphic-fetch';
import sharp from 'sharp';

const MAX_AVATAR_BYTES = 10 * 1024 * 1024;
const MAX_AVATAR_REDIRECTS = 3;
const MAX_AVATAR_SIZE = 512;
const ALLOWED_AVATAR_CONTENT_TYPES = new Set([
  'application/octet-stream',
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/webp',
]);

const FIXED_AVATAR_ORIGINS = [
  'https://member-media.topcoder.com',
  'https://member-media.topcoder-dev.com',
  'https://topcoder-dev-media.s3.amazonaws.com',
  'https://topcoder-prod-media.s3.amazonaws.com',
];

/**
 * Gets the origin from an application URL without propagating malformed config.
 * @param {String} value Configured application URL.
 * @return {String|null} Normalized origin.
 */
function getConfiguredOrigin(value) {
  try {
    return value ? new URL(value).origin : null;
  } catch (e) {
    return null;
  }
}

const ALLOWED_AVATAR_ORIGINS = new Set(
  FIXED_AVATAR_ORIGINS.concat([
    getConfiguredOrigin(config.URL && config.URL.BASE),
    getConfiguredOrigin(config.CDN && config.CDN.PUBLIC),
  ]).filter(Boolean),
);

/**
 * Normalizes an avatar URL and rejects destinations outside trusted media origins.
 * @param {String} value Avatar URL supplied by the member API.
 * @param {String} baseUrl Base URL used for legacy relative avatar paths.
 * @return {URL} Validated avatar URL.
 */
export function normalizeAvatarUrl(value, baseUrl = config.URL.BASE) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Invalid avatar URL');
  }

  let parsed;
  try {
    parsed = value.startsWith('/') ? new URL(value, baseUrl) : new URL(value);
  } catch (e) {
    throw new Error('Invalid avatar URL');
  }

  if (parsed.protocol !== 'https:'
    || parsed.username
    || parsed.password) {
    throw new Error('Avatar URL is not trusted');
  }

  const trustedOrigin = Array.from(ALLOWED_AVATAR_ORIGINS)
    .find(origin => origin === parsed.origin);
  if (!trustedOrigin) {
    throw new Error('Avatar URL is not trusted');
  }

  let encodedPath;
  try {
    encodedPath = parsed.pathname
      .split('/')
      .map(segment => encodeURIComponent(decodeURIComponent(segment)))
      .join('/');
  } catch (e) {
    throw new Error('Invalid avatar URL');
  }

  const encodedQuery = [];
  parsed.searchParams.forEach((queryValue, queryName) => {
    encodedQuery.push(
      `${encodeURIComponent(queryName)}=${encodeURIComponent(queryValue)}`,
    );
  });

  const normalized = new URL(trustedOrigin);
  normalized.pathname = encodedPath;
  normalized.search = encodedQuery.length ? `?${encodedQuery.join('&')}` : '';
  return normalized;
}

/**
 * Fetches a trusted avatar while revalidating every redirect destination.
 * @param {URL} target Validated avatar URL.
 * @param {Number} redirectCount Number of redirects followed so far.
 * @return {Promise<Buffer>} Bounded image response body.
 */
async function fetchAvatar(target, redirectCount = 0) {
  const img = await fetch(target.href, {
    redirect: 'manual',
    size: MAX_AVATAR_BYTES,
  });

  if (img.status >= 300 && img.status < 400) {
    const location = img.headers.get('location');
    if (!location || redirectCount >= MAX_AVATAR_REDIRECTS) {
      throw new Error('Failed to get user avatar');
    }
    const redirectUrl = normalizeAvatarUrl(new URL(location, target).href);
    return fetchAvatar(redirectUrl, redirectCount + 1);
  }

  if (!img.ok) {
    throw new Error('Failed to get user avatar');
  }

  const contentLength = Number(img.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_AVATAR_BYTES) {
    throw new Error('Avatar image is too large');
  }

  const contentType = (img.headers.get('content-type') || '')
    .split(';')[0]
    .trim()
    .toLowerCase();
  if (!ALLOWED_AVATAR_CONTENT_TYPES.has(contentType)) {
    throw new Error('Avatar response is not a supported image');
  }

  const body = await img.buffer();
  if (body.length > MAX_AVATAR_BYTES) {
    throw new Error('Avatar image is too large');
  }
  return body;
}

/**
 * Gets user avatar and scales it to the specified size.
 * @param {String} url Avatar URL, as returned by the API. This function will
 *  make all necessary URL normalization itself.
 * @param {Number} size Target size. Returned avatar will be scaled, keeping its
 *  aspect ratio, to fit into the square of the specified size.
 * @return {Promise} Resuting avatar.
 */
export default async function getAvatar(url, size) {
  if (!Number.isInteger(size) || size < 1 || size > MAX_AVATAR_SIZE) {
    throw new Error('Invalid avatar size');
  }

  const target = normalizeAvatarUrl(url);
  const body = await fetchAvatar(target);
  return sharp(body, { limitInputPixels: 40000000 })
    .resize(size, size, { fit: 'inside' })
    .toBuffer();
}
