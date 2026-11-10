
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
/* eslint-disable no-console, no-param-reassign, no-underscore-dangle, no-restricted-globals */

precacheAndRoute(self.__WB_MANIFEST);


/**
 * The cache name format is "<prefix>-<cacheName>-<version>"
 * If you want to clear a cache, just change its version.
 *
 * But nomarlly you don't need change cache version or clear cache because:
 * 1. The js/css themselves are already versioned by webpack building
 * 2. The cache will be auto cleared when cache quota size limit exceeded
 */
const prefix = 'community-app';
const fontsCacheName = `${prefix}-fonts-0.0.1`;
const jscssCacheName = `${prefix}-jscss-0.0.1`;
const imagesCacheName = `${prefix}-images-0.0.1`;
const thirdpartCacheName = `${prefix}-thirdpart-0.0.1`;
const apiV2CacheName = `${prefix}-api-v2-0.0.1`;
const apiV3CacheName = `${prefix}-api-v3-0.0.1`;
const apiV4CacheName = `${prefix}-api-v4-0.0.1`;
const apiV5CacheName = `${prefix}-api-v5-0.0.1`;
const miscPageCacheName = `${prefix}-misc-page-0.0.1`;

const currentCacheNames = [
  fontsCacheName, jscssCacheName, imagesCacheName, thirdpartCacheName, miscPageCacheName,
  apiV2CacheName, apiV3CacheName, apiV4CacheName, apiV5CacheName];

self.addEventListener('activate', (event) => {
  // Delete old cache if version changed
  const promis = self.caches
    .keys()
    .then(keys => keys.filter(
      key => key.indexOf(prefix) === 0 && currentCacheNames.indexOf(key) === -1,
    ))
    .then(keys => Promise.all(keys.map((key) => {
      console.log(`Delete cache ${key}`);
      return self.caches.delete(key);
    })));
  event.waitUntil(promis);
});

// Expiration plugin to purge cache when quota size limit exceeded
function expirationPlugin(maxEntries) {
  return new ExpirationPlugin({
    maxEntries,
    purgeOnQuotaError: true,
  });
}

const challengesHandler = async (event, url, detailPage) => {
  let { request } = event;

  request = new Request(url.href, { ...request, mode: 'same-origin' });

  // Request cached page and will also refresh cached page
  const strategy = new StaleWhileRevalidate(
    { cacheName: miscPageCacheName, plugins: [expirationPlugin(200)] },
  );

  try {
    return await strategy.handle({ event, request });
  } catch (e) {
    if (!detailPage) {
      throw e;
    }
  }

  // Network offline and no cached page, try to use cached '/challenges' page to render.
  // Note currently the challenge details page does not have full client side rendering support,
  // which means when offline, you may see some mis-behavior like the expected tab not activated
  // (like when visit /challenges/12345678/?tab=registrants offline).
  // This also means, in future when challenge details page has full client side rendering support,
  // we can simply switch to use the cached '/challenges' page as entrypoint to render.
  request = new Request('/challenges', { ...request, mode: 'same-origin' });
  return strategy.handle({ event, request });
};

// Serve challenge listing page like: /challenges?xxx=yyy
registerRoute(/\/challenges(\/)?(\?.*)?$/, async ({ event, url }) => {
  url.pathname = '/challenges';
  url.search = ''; // Challenges listing page has full client side support
  return challengesHandler(event, url);
}, 'GET');

// Serve challenge details pages like: /challenges/12345678
registerRoute(/\/challenges\/((([\w]{4,12}-?){5}|\d{5,8}))(\/)?(.*)/, async ({ event, url }) => {
  if (url.pathname.endsWith('/')) {
    // Remove ending '/' char
    url.pathname = url.pathname.substring(0, url.pathname.length - 1);
  }
  return challengesHandler(event, url, true);
}, 'GET');

// Cache fonts
// (Note when deployed in production, the static assets will be served by cloudfront CDN)
registerRoute(/http(s)?:\/\/.*cloudfront\.net\/.*\.(?:woff|eot|ttf)(\?.*)?$/, new CacheFirst({ cacheName: fontsCacheName, plugins: [expirationPlugin(20)] }), 'GET');
registerRoute(/\.(?:woff|eot|ttf)(\?.*)?$/, new CacheFirst({ cacheName: fontsCacheName, plugins: [expirationPlugin(20)] }), 'GET');

// Cache js/css/images
// (Note when deployed in production, the static assets will be served by cloudfront CDN)
registerRoute(/\.(?:js|css)(\?.*)?$/, new StaleWhileRevalidate({ cacheName: jscssCacheName, plugins: [expirationPlugin(50)] }), 'GET');
registerRoute(/http(s)?:\/\/.*cloudfront\.net\/.*\.(?:js|css)(\?.*)?$/, new StaleWhileRevalidate({ cacheName: jscssCacheName, plugins: [expirationPlugin(50)] }), 'GET');
registerRoute(/\.(?:png|jpg|jpeg|svg|gif)(\?.*)?$/, new StaleWhileRevalidate({ cacheName: imagesCacheName, plugins: [expirationPlugin(200)] }), 'GET');
registerRoute(/http(s)?:\/\/.*cloudfront\.net\/.*\.(?:png|jpg|jpeg|svg|gif)(\?.*)?$/, new StaleWhileRevalidate({ cacheName: imagesCacheName, plugins: [expirationPlugin(200)] }), 'GET');

// Cache api v2/v3/v4/v5
registerRoute(/http(s)?:\/\/api\.(?:topcoder|topcoder-dev)\.com\/v2\/(.*)/, new NetworkFirst({ cacheName: apiV2CacheName, plugins: [expirationPlugin(200)] }), 'GET');
registerRoute(/http(s)?:\/\/api\.(?:topcoder|topcoder-dev)\.com\/v3\/(.*)/, new NetworkFirst({ cacheName: apiV3CacheName, plugins: [expirationPlugin(200)] }), 'GET');
registerRoute(/http(s)?:\/\/api\.(?:topcoder|topcoder-dev)\.com\/v4\/(.*)/, new NetworkFirst({ cacheName: apiV4CacheName, plugins: [expirationPlugin(200)] }), 'GET');
registerRoute(/http(s)?:\/\/api\.(?:topcoder|topcoder-dev)\.com\/v5\/(.*)/, new NetworkFirst({ cacheName: apiV5CacheName, plugins: [expirationPlugin(200)] }), 'GET');

// Cache misc apis/pages
registerRoute(/http(s)?:\/\/.*\.cloudfront\.net\/exchange-rates$/, new StaleWhileRevalidate({ cacheName: miscPageCacheName, plugins: [expirationPlugin(200)] }), 'GET');
registerRoute(/http(s)?:\/\/.*\.herokuapp\.com\/saved-searches$/, new StaleWhileRevalidate({ cacheName: miscPageCacheName, plugins: [expirationPlugin(200)] }), 'GET');
registerRoute(/http(s)?:\/\/.*\/contentful\/(.*)/, new StaleWhileRevalidate({ cacheName: miscPageCacheName, plugins: [expirationPlugin(200)] }), 'GET');
registerRoute(/http(s)?:\/\/.*community-app-assets\/api\/tc-communities(.*)/, new StaleWhileRevalidate({ cacheName: miscPageCacheName, plugins: [expirationPlugin(200)] }), 'GET');

// Cache third part
registerRoute(/http(s)?:\/\/.*(?:google-analytics\.com|addthis\.com|addthisedge\.com|hotjar\.com|ravenjs\.com|trychameleon\.com|googletagmanager\.com|hotjar\.com|facebook\.net|hs-scripts\.com|hs-analytics\.net|hsadspixel\.net)\/.*\.(?:js|html|config_resp)(\?.*)?$/, new StaleWhileRevalidate({ cacheName: thirdpartCacheName, plugins: [expirationPlugin(100)] }), 'GET');

self.skipWaiting();
clientsClaim();
