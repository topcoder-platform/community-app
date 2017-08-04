/**
 * The service for currency conversions. It uses currency rates provided by
 * https://openexchangerates.org, and caches them server-side, to minimize
 * the number of API requests (the free Open Exchange allows up to 1000 API
 * requests per month).
 */

/* global window */

import _ from 'lodash';
import config from 'utils/config';
import fetch from 'isomorphic-fetch';
import fx from 'money';
import { isClientSide } from 'utils/isomorphy';

const OE_API = 'https://openexchangerates.org/api';
const OE_TOKEN = config.OPEN_EXCHANGE.TOKEN;

let cachedRates;

/* NOTE: On client-side such injection via window guarantees that we have some
 * rates cached from the very beginning, thus convertNow(..) and getRatesNow(..)
 * functions are always safe to use (i.e. they might use a bit outdated rates,
 * but they will never fail). */
if (isClientSide()) {
  cachedRates = window.EXCHANGE_RATES;
  fx.base = cachedRates.base;
  fx.rates = cachedRates.rates;
}

/**
 * Refreshes cached rate values, if necessary.
 * @return {Promise} Resolves to undefined once the operation is completed.
 */
function refresh() {
  if (cachedRates) {
    const age = (Date.now() / 1000) - cachedRates.timestamp;
    /* 3600 = number of seconds in an hour */
    if (age < 3600 * config.OPEN_EXCHANGE.MAXAGE) return Promise.resolve();
  }
  const url = isClientSide() ? '/api/exchange-rates'
    : `${OE_API}/latest.json?app_id=${OE_TOKEN}`;
  return fetch(url).then(res => res.json()).then((res) => {
    cachedRates = res;
    fx.base = res.base;
    fx.rates = res.rates;
  });
}

refresh();

/**
 * Converts specified amount of money to another currency.
 * @param {Number} amount Amount of money to convert.
 * @param {String} to Target currency (3-letters code as USD, EUR, etc.).
 * @param {String} from Optional. Original currency. Defaults to USD.
 * @return {Promise} Resolves to the result of conversion. In most cases it is
 *  resolved immediately, but from time to time it will have to wait for async
 *  operations necessary to update the cached currency rates.
 */
export function convert(amount, to, from = 'USD') {
  return refresh().then(() => fx.convert(amount, { from, to }));
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
  refresh();
  return fx.convert(amount, { from, to });
}

/**
 * Returns exchange rates.
 * @return {Promise}
 */
export function getRates() {
  return refresh().then(() => _.clone(cachedRates));
}

/**
 * Same as getRates(..) but works syncroneously, using the cached rates.
 * @return {Promise}
 */
export function getRatesNow() {
  refresh();
  return _.clone(cachedRates);
}

export default undefined;
