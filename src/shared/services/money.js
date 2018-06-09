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

/**
 * For optimal performance currency exchanged rates are cached and updated once
 * per config.OPEN_EXCHANGE.MAXAGE hours.
 *
 * Initial cached rated are injected into client side via window.EXCHANGE_RATES
 * during page rendering at the server-side. This way it is ensured that some
 * cached rates are always available, thus syncroneous functions are safe.
 *
 * At the server side, in addition to in-memory caching, the rates are also
 * cached at the hard-drive, and the initial cached rates are read from there,
 * when the app is started. Otherwise, the free quota for accessing
 * http://openexchangerates.com runs out extremely rapidly during development,
 * due to frequent restarts of the code.
 */

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

updateCache();

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
  await updateCache();
  return fx.convert(amount, { from, to });
}

/**
 * Same as convert(..), but works syncroneously (using cached rates).
 * This function still triggers refreshement of the cached rates if necessary,
 * but it does not wait for the result, and just uses cached rates for the
 * actual conversion. It is safe to use anyway
 * @param {Number} amount
 * @param {String} to
 * @param {String} from
 * @return {Number}
 */
export function convertNow(amount, to, from = 'USD') {
  updateCache();
  return fx.convert(amount, { from, to });
}

/**
 * Returns exchange rates.
 * @return {Promise}
 */
export async function getRates() {
  await updateCache();
  return _.cloneDeep(cache);
}

/**
 * Same as getRates(..) but works syncroneously, using the cached rates.
 * @return {Promise}
 */
export function getRatesNow() {
  updateCache();
  return _.cloneDeep(cache);
}
