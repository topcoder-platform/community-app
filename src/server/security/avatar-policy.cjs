const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 16 * 1024 * 1024;

function avatarRequest(input, size, baseUrl, allowedOrigins) {
  if (typeof input !== 'string' || input.length > 4096) throw new Error('Invalid avatar URL');
  const url = new URL(input, baseUrl);
  const origin = [...allowedOrigins].find(allowed => allowed === url.origin);
  if (url.protocol !== 'https:' || url.username || url.password || !origin) {
    throw new Error('Avatar origin is not allowed');
  }
  const dimension = size === undefined ? 100 : Number(size);
  if (!Number.isInteger(dimension) || dimension < 16 || dimension > 1024) {
    throw new Error('Avatar size must be an integer between 16 and 1024');
  }
  // Use the configured origin, never the request's host, for the network call.
  return { origin, path: `${url.pathname}${url.search}`, dimension };
}

module.exports = { avatarRequest, MAX_IMAGE_BYTES, MAX_IMAGE_PIXELS };
