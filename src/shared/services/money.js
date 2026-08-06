/**
 * The service for currency conversions.
 *
 * TODO: Refactor the service and its use cases to be async, and relying on
 * Redux store in the normal way.
 */


import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import fx from 'money';
import { config, isomorphy } from 'topcoder-react-utils';

const CDN_URL = config.CDN.PUBLIC;
const MAX_AGE = 60 * 60 * 1000;

let cache = { timestamp: 0 };

if (isomorphy.isClientSide()) cache = config.EXCHANGE_RATES;

if (cache) {
  fx.base = cache.base;
  fx.rates = cache.rates;
}

/**
 * Refreshes cached rate values, if necessary.
 * @return {Promise} Resolves to undefined once the operation is completed.
 */
async function updateCache() {
  if (Date.now() - cache.timestamp < MAX_AGE) return;
  const upd = await fetch(`${CDN_URL}/exchange-rates`);
  if (!upd.ok) throw new Error(upd.statusText);
  cache = await upd.json();
  fx.base = cache.base;
  fx.rates = cache.rates;
}

/**
 * Starts a cache refresh without blocking synchronous callers.
 *
 * Used during module initialization and by the synchronous public methods.
 * Refresh failures are consumed so existing cached rates remain available
 * instead of creating an unhandled Promise rejection.
 * @return {void}
 */
function refreshCacheInBackground() {
  updateCache().catch(_.noop);
}

refreshCacheInBackground();

/**
 * Converts specified amount of money to another currency.
 * @param {Number} amount Amount of money to convert.
 * @param {String} to Target currency (3-letters code as USD, EUR, etc.).
 * @param {String} from Optional. Original currency. Defaults to USD.
 * @return {Promise} Resolves to the result of conversion. In most cases it is
 *  resolved immediately, but from time to time it will have to wait for async
 *  operations necessary to update the cached currency rates.
 */
export async function convert(amount, to, from = 'USD') {
  try {
    await updateCache();
  } catch (error) {
    // exchange-rates failed, reason: socket hang up
  }
  return fx.convert(amount, { from, to });
}

/**
 * Converts an amount synchronously using cached rates while triggering a
 * non-blocking refresh when the cache is stale. Refresh failures are ignored
 * and leave the existing cache in place.
 * @param {Number} amount Amount of money to convert.
 * @param {String} to Target currency (3-letter code such as USD or EUR).
 * @param {String} from Original currency. Defaults to USD.
 * @return {Number} Converted amount.
 */
export function convertNow(amount, to, from = 'USD') {
  refreshCacheInBackground();
  return fx.convert(amount, { from, to });
}

/**
 * Returns exchange rates.
 * @return {Promise}
 */
export async function getRates() {
  try {
    await updateCache();
  } catch (error) {
    // exchange-rates failed, reason: socket hang up
  }
  return _.cloneDeep(cache);
}

/**
 * Returns cached exchange rates synchronously while triggering a non-blocking
 * refresh when the cache is stale. Refresh failures leave the cache unchanged.
 * @return {Object} A clone of the cached exchange-rate data.
 */
export function getRatesNow() {
  refreshCacheInBackground();
  return _.cloneDeep(cache);
}
