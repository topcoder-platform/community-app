/**
 * The service for currency conversions. It uses currency rates provided by
 * https://openexchangerates.org, and caches them server-side, to minimize
 * the number of API requests (the free Open Exchange allows up to 1000 API
 * requests per month).
 */

/* global window */

import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import fs from 'fs';
import fx from 'money';
import { logger } from 'topcoder-react-lib';
import path from 'path';
import { config, isomorphy } from 'topcoder-react-utils';

const DISK_CACHE = path.resolve(__dirname, '../../../.exchange-rates.cache');
const OE_API = 'https://openexchangerates.org/api';
const OE_TOKEN = config.OPEN_EXCHANGE.TOKEN;

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

let cachedRates;

if (isomorphy.isClientSide()) cachedRates = window.CONFIG.EXCHANGE_RATES;
else if (fs.existsSync(DISK_CACHE)) {
  cachedRates = JSON.parse(fs.readFileSync(DISK_CACHE, 'utf8'));
}

if (cachedRates) {
  fx.base = cachedRates.base;
  fx.rates = cachedRates.rates;
}

/**
 * Refreshes cached rate values, if necessary.
 * @return {Promise} Resolves to undefined once the operation is completed.
 */
function refresh() {
  if (cachedRates) {
    const age = Date.now() - (1000 * cachedRates.timestamp);
    if (age < 3600000 * config.OPEN_EXCHANGE.MAXAGE) {
      return Promise.resolve();
    }
  }
  const url = isomorphy.isClientSide() ? '/community-app-assets/api/exchange-rates'
    : `${OE_API}/latest.json?app_id=${OE_TOKEN}`;
  return fetch(url, {
    headers: {
      Authorization: `ApiKey ${config.SERVER_API_KEY}`,
    },
  }).then(res => res.json()).then((res) => {
    cachedRates = res;
    fx.base = res.base;
    fx.rates = res.rates;
    if (isomorphy.isServerSide()) {
      logger.info('Exchange rates synced with https://openexchangerates.com');
      fs.writeFile(DISK_CACHE, JSON.stringify(cachedRates));
    }
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
