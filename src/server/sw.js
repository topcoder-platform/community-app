/* global self, caches, fetch, Request, URL */
/* eslint-disable no-console, no-restricted-globals */

/**
 * Community App service worker.
 *
 * Only public pages and static assets are cached. Authenticated API responses
 * deliberately remain network-only so user data cannot persist in a browser
 * cache after logout.
 */

const CACHE_PREFIX = 'community-app';
const CACHE_VERSION = '1.0.0';
const CACHE_NAMES = {
  fonts: `${CACHE_PREFIX}-fonts-${CACHE_VERSION}`,
  images: `${CACHE_PREFIX}-images-${CACHE_VERSION}`,
  pages: `${CACHE_PREFIX}-pages-${CACHE_VERSION}`,
  scripts: `${CACHE_PREFIX}-scripts-${CACHE_VERSION}`,
};
const CACHE_LIMITS = {
  [CACHE_NAMES.fonts]: 20,
  [CACHE_NAMES.images]: 200,
  [CACHE_NAMES.pages]: 100,
  [CACHE_NAMES.scripts]: 75,
};

/**
 * Removes the oldest entries when a cache exceeds its configured bound.
 *
 * @param {Cache} cache Cache instance.
 * @param {Number} maxEntries Maximum retained entries.
 * @return {Promise<void>} Resolves after any old entries are removed.
 */
async function trimCache(cache, maxEntries) {
  const keys = await cache.keys();
  const overflow = keys.length - maxEntries;
  if (overflow > 0) {
    await Promise.all(keys.slice(0, overflow).map(key => cache.delete(key)));
  }
}

/**
 * Determines whether a response is safe to store.
 *
 * @param {Response} response Fetch response.
 * @return {Boolean} Whether the response may be cached.
 */
function isCacheable(response) {
  if (!response || (!response.ok && response.type !== 'opaque')) return false;
  const cacheControl = response.headers.get('cache-control') || '';
  return !/(?:no-store|private)/i.test(cacheControl);
}

/**
 * Stores a response clone and enforces the cache size bound.
 *
 * @param {String} cacheName Cache name.
 * @param {Request} request Request key.
 * @param {Response} response Response to store.
 * @return {Promise<void>} Resolves after the cache write.
 */
async function storeResponse(cacheName, request, response) {
  if (!isCacheable(response)) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  await trimCache(cache, CACHE_LIMITS[cacheName]);
}

/**
 * Returns cached content immediately while refreshing it in the background.
 *
 * @param {FetchEvent} event Fetch event.
 * @param {Request} request Request to load.
 * @param {String} cacheName Cache name.
 * @return {Promise<Response>} Cached or network response.
 */
async function staleWhileRevalidate(event, request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request).then(async (response) => {
    await storeResponse(cacheName, request, response);
    return response;
  });

  if (cached) {
    event.waitUntil(network.catch(() => undefined));
    return cached;
  }
  return network;
}

/**
 * Returns a cached response, falling back to the network.
 *
 * @param {Request} request Request to load.
 * @param {String} cacheName Cache name.
 * @return {Promise<Response>} Cached or network response.
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  await storeResponse(cacheName, request, response);
  return response;
}

/**
 * Normalizes challenge URLs so query strings do not fragment the page cache.
 *
 * @param {URL} source Requested URL.
 * @return {Request} Safe same-origin cache request.
 */
function challengeRequest(source) {
  const url = new URL(source.href);
  const detail = /^\/challenges\/[^/]+/.test(url.pathname);
  if (!detail) url.pathname = '/challenges';
  url.pathname = url.pathname.replace(/\/$/, '') || '/challenges';
  url.search = '';
  url.hash = '';
  return new Request(url.href, {
    credentials: 'same-origin',
    method: 'GET',
  });
}

/**
 * Serves a challenge page and falls back to the listing shell when offline.
 *
 * @param {FetchEvent} event Fetch event.
 * @param {URL} url Requested URL.
 * @return {Promise<Response>} Challenge response.
 */
async function challengeHandler(event, url) {
  const request = challengeRequest(url);
  try {
    return await staleWhileRevalidate(event, request, CACHE_NAMES.pages);
  } catch (error) {
    if (request.url.endsWith('/challenges')) throw error;
    const fallback = new Request(`${url.origin}/challenges`, {
      credentials: 'same-origin',
      method: 'GET',
    });
    const cached = await caches.match(fallback);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener('activate', (event) => {
  const currentNames = new Set(Object.values(CACHE_NAMES));
  event.waitUntil(
    caches.keys()
      .then(keys => keys.filter(
        key => key.startsWith(`${CACHE_PREFIX}-`) && !currentNames.has(key),
      ))
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin === self.location.origin && /^\/challenges(?:\/|$)/.test(url.pathname)) {
    event.respondWith(challengeHandler(event, url));
    return;
  }

  if (/\.(?:woff2?|eot|otf|ttf)(?:$|\?)/i.test(url.href)) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.fonts));
    return;
  }

  if (/\.(?:js|css)(?:$|\?)/i.test(url.href)) {
    event.respondWith(staleWhileRevalidate(event, request, CACHE_NAMES.scripts));
    return;
  }

  if (/\.(?:png|jpe?g|svg|gif)(?:$|\?)/i.test(url.href)) {
    event.respondWith(staleWhileRevalidate(event, request, CACHE_NAMES.images));
  }
});
