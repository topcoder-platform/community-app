const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 16 * 1024 * 1024;

function avatarRequest(input, size, baseUrl, allowedOrigins) {
  if (typeof input !== 'string' || input.length > 4096) throw new Error('Invalid avatar URL');
  const url = new URL(input, baseUrl);
  if (url.protocol !== 'https:' || url.username || url.password
      || !allowedOrigins.has(url.origin)) throw new Error('Avatar origin is not allowed');
  const dimension = size === undefined ? 100 : Number(size);
  if (!Number.isInteger(dimension) || dimension < 16 || dimension > 1024) {
    throw new Error('Avatar size must be an integer between 16 and 1024');
  }
  url.hash = '';
  return { url: url.href, dimension };
}

module.exports = { avatarRequest, MAX_IMAGE_BYTES, MAX_IMAGE_PIXELS };
