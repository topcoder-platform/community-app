/* global self workbox */
/* eslint-disable no-underscore-dangle, no-restricted-globals */

// Config debug mode
const selfUrl = new URL(self.location.href);
const debug = selfUrl.searchParams.has('debug');
workbox.setConfig({ debug });

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
const jscssimagesCacheName = `${prefix}-jscssimages-0.0.1`;
const thirdpartCacheName = `${prefix}-thirdpart-0.0.1`;
const apiV2CacheName = `${prefix}-api-v2-0.0.1`;
const apiV3CacheName = `${prefix}-api-v3-0.0.1`;
const apiV4CacheName = `${prefix}-api-v4-0.0.1`;
const miscPageCacheName = `${prefix}-misc-page-0.0.1`;

// The version for precache
const precacheVersion = '0.0.1';
workbox.core.setCacheNameDetails({
  prefix,
  suffix: precacheVersion,
});
const preCacheName = `${prefix}-precache-${precacheVersion}`;

const currentCacheNames = [fontsCacheName, jscssimagesCacheName, thirdpartCacheName,
  apiV2CacheName, apiV3CacheName, apiV4CacheName, miscPageCacheName,
  preCacheName, `${preCacheName}-temp`];


self.addEventListener('activate', (event) => {
  // Delete old cache if version changed
  const promis = self.caches
    .keys()
    .then(keys => keys.filter(
      key => key.indexOf(prefix) === 0 && currentCacheNames.indexOf(key) === -1,
    ))
    .then(keys => Promise.all(keys.map((key) => {
      console.log(`Delete cache ${key}`); // eslint-disable-line no-console
      return self.caches.delete(key);
    })));
  event.waitUntil(promis);
});

// Precache major js/css, like: main.js, polyfills.js, topcoder-website/chunk.js
const precacheManifest = [];
self.__precacheManifest.forEach((item) => {
  if (/.*\/main-\d*\.css/.test(item.url)
  || /.*\/main-\d*\.js/.test(item.url)
  || /.*\/polyfills-\d*\.js/.test(item.url)
  || /.*\/topcoder-website\/chunk-\d*\.css/.test(item.url)
  || /.*\/topcoder-website\/chunk-\d*\.js/.test(item.url)
  || /.*\/loading-indicator-animation-\d*\.js/.test(item.url)) {
    precacheManifest.push(item);
  }
});

// Precache /challenges page for offline loading
precacheManifest.push({ url: '/challenges', revision: `${Date.now()}` });

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(precacheManifest, {});

// Expiration plugin to purge cache when quota size limit exceeded
function expirationPlugin(maxEntries) {
  return new workbox.expiration.Plugin({
    maxEntries,
    purgeOnQuotaError: true,
  });
}

// Serve challenge listing page like: /challenges?xxx=yyy
const challengesHandler = async ({ event }) => {
  // See if there is precached one
  const precache = await self.caches.open(preCacheName);
  const cachedResponse = await precache.match('/challenges');
  if (cachedResponse) {
    return cachedResponse;
  }

  // Fetch the page
  const response = await self.fetch(event.request, { mode: 'same-origin' });
  precache.put('/challenges', response);
  return response;
};
workbox.routing.registerRoute(/\/challenges(\/)?(\?.*)?$/, challengesHandler, 'GET');

// Serve challenge details pages like: /challenges/12345678
const challengeDetailsHandler = async ({ url, event }) => {
  let { request } = event;

  // Remove ending '/' of url
  if (url.pathname.endsWith('/')) {
    url.pathname = url.pathname.substring(0, url.pathname.length - 1); // eslint-disable-line
    request = new self.Request(url.href, { ...request, mode: 'same-origin' });
  }

  try {
    // The challenge details page has full server side rendering support
    // Make request to the page and if offline will use cached page
    const strategy = workbox.strategies.staleWhileRevalidate(
      { cacheName: miscPageCacheName, plugins: [expirationPlugin(100)] },
    );
    const response = await strategy.makeRequest({ event, request });
    if (response) {
      return response;
    }
  } catch (e) { console.error(e); } // eslint-disable-line no-console

  // Network offline and no cached page, try to use precached '/challenges' page to render.
  // Note currently the challenge details page does not have full client side rendering support,
  // which means when offline, you may see some mis-behavior like the expected tab not activated
  // (like when visit /challenges/12345678/?tab=registrants offline).
  // This also means, in future when challenge details page has full client side rendering support,
  // we can simply switch to use the precached '/challenges' page as entrypoint to render.
  return challengesHandler({ event });
};
workbox.routing.registerRoute(/\/challenges\/\d+(\/)?(.*)/, challengeDetailsHandler, 'GET');

// Cache fonts
// (Note when deployed in production, the static assets will be served by cloudfront CDN)
workbox.routing.registerRoute(/http(s)?:\/\/.*cloudfront\.net\/.*\.(?:woff|eot|ttf)(\?.*)?$/, workbox.strategies.cacheFirst({ cacheName: fontsCacheName, plugins: [expirationPlugin(10)] }), 'GET');
workbox.routing.registerRoute(/\.(?:woff|eot|ttf)(\?.*)?$/, workbox.strategies.cacheFirst({ cacheName: fontsCacheName, plugins: [expirationPlugin(10)] }), 'GET');

// Cache js/css/images
// (Note when deployed in production, the static assets will be served by cloudfront CDN)
workbox.routing.registerRoute(/http(s)?:\/\/.*cloudfront\.net\/.*\.(?:js|css|png|jpg|jpeg|svg|gif)(\?.*)?$/, workbox.strategies.staleWhileRevalidate({ cacheName: jscssimagesCacheName, plugins: [expirationPlugin(100)] }), 'GET');
workbox.routing.registerRoute(/\.(?:js|css|png|jpg|jpeg|svg|gif)(\?.*)?$/, workbox.strategies.staleWhileRevalidate({ cacheName: jscssimagesCacheName, plugins: [expirationPlugin(100)] }), 'GET');

// Cache api v2/v3/v4
workbox.routing.registerRoute(/http(s)?:\/\/api\.(?:topcoder|topcoder-dev)\.com\/v2\/(.*)/, workbox.strategies.networkFirst({ cacheName: apiV2CacheName, plugins: [expirationPlugin(10)] }), 'GET');
workbox.routing.registerRoute(/http(s)?:\/\/api\.(?:topcoder|topcoder-dev)\.com\/v3\/(.*)/, workbox.strategies.networkFirst({ cacheName: apiV3CacheName, plugins: [expirationPlugin(10)] }), 'GET');
workbox.routing.registerRoute(/http(s)?:\/\/api\.(?:topcoder|topcoder-dev)\.com\/v4\/(.*)/, workbox.strategies.networkFirst({ cacheName: apiV4CacheName, plugins: [expirationPlugin(50)] }), 'GET');

// Cache misc apis
workbox.routing.registerRoute(/http(s)?:\/\/.*\.cloudfront\.net\/exchange-rates$/, workbox.strategies.staleWhileRevalidate({ cacheName: miscPageCacheName, plugins: [expirationPlugin(100)] }), 'GET');
workbox.routing.registerRoute(/http(s)?:\/\/.*contentful\/published\/entries(.*)/, workbox.strategies.staleWhileRevalidate({ cacheName: miscPageCacheName, plugins: [expirationPlugin(100)] }), 'GET');
workbox.routing.registerRoute(/http(s)?:\/\/.*community-app-assets\/api\/tc-communities(.*)/, workbox.strategies.staleWhileRevalidate({ cacheName: miscPageCacheName, plugins: [expirationPlugin(100)] }), 'GET');

// Cache third part
workbox.routing.registerRoute(/http(s)?:\/\/.*(?:google-analytics\.com|addthis\.com|addthisedge\.com|hotjar\.com|ravenjs\.com|trychameleon\.com|googletagmanager\.com|zendesk\.com|zdassets\.com|hotjar\.com|facebook\.net|hs-scripts\.com|hs-analytics\.net|hsadspixel\.net)\/.*\.(?:js|html|config_resp)(\?.*)?$/, workbox.strategies.staleWhileRevalidate({ cacheName: thirdpartCacheName, plugins: [expirationPlugin(50)] }), 'GET');

workbox.skipWaiting();
workbox.clientsClaim();
