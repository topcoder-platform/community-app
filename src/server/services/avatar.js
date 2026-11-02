/** Fetch and resize avatars from explicitly trusted Topcoder image origins. */
import config from 'config';
import fetch from 'isomorphic-fetch';
import sharp from 'sharp';
import { avatarRequest, MAX_IMAGE_BYTES, MAX_IMAGE_PIXELS } from '../security/avatar-policy.cjs';

const allowedOrigins = new Set([
  config.URL.BASE,
  config.CDN.PUBLIC,
  'https://topcoder-dev-media.s3.amazonaws.com',
  'https://topcoder-media.s3.amazonaws.com',
  ...(process.env.AVATAR_ALLOWED_ORIGINS || '').split(','),
].map(origin => origin.trim()).filter(Boolean));

export default async function getAvatar(url, size) {
  const request = avatarRequest(url, size, config.URL.BASE, allowedOrigins);
  const img = await fetch(`${request.origin}${request.path}`, {
    redirect: 'error',
    timeout: 10000,
    size: MAX_IMAGE_BYTES,
  });
  if (!img.ok) throw new Error('Failed to get user avatar');
  return sharp(await img.buffer(), { limitInputPixels: MAX_IMAGE_PIXELS })
    .resize(request.dimension, request.dimension, { fit: 'inside' })
    .toBuffer();
}
