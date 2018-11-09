/**
 * A simple, one-function service that fetches specified user vatars from the TC
 * backend and returns them in the specified size.
 */

import config from 'config';
import fetch from 'isomorphic-fetch';
import sharp from 'sharp';

/**
 * Gets user avatar and scales it to the specified size.
 * @param {String} url Avatar URL, as returned by the API. This function will
 *  make all necessary URL normalization itself.
 * @param {Number} size Target size. Returned avatar will be scaled, keeping its
 *  aspect ratio, to fit into the square of the specified size.
 * @return {Promise} Resuting avatar.
 */
export default async function getAvatar(url, size) {
  const u = url && url.startsWith('/') ? `${config.URL.BASE}/${url}` : url;
  const img = await fetch(u);
  if (!img.ok) throw new Error('Failed to get user avatar');
  return sharp(await img.buffer())
    .resize(size, size).max()
    .toFormat('jpeg')
    .toBuffer();
}
