/**
 * Server-side cache and proxy-service for openexchangerates.org API.
 * We use the free version of that API, which has the limit 1000 call per month,
 * thus, caching rates server-side helps to not violate that limit.
 */

import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import { config } from 'topcoder-react-utils';

/* Refreshing cache once per 12 hours will keep amount of calls from a single
 * running server ~60 calls / month. We use the same Open Exchange Rates account
 * in dev and prod, thus ~120 calls / month + some more due to redeployments,
 * etc. */
const MAX_AGE = 12 * 60 * 60 * 1000; /* 12 hours in ms */

const OER_API = 'https://openexchangerates.org/api';
const OER_KEY = config.SECRET.OPEN_EXCHANGE_RATES_KEY;

let cache = { timestamp: 0 };

/**
 * Refreshes cache, if necessary (if outdated more than MAX_AGE).
 * @return {Promise} Resolves when operation is completed.
 * Rejects with the error in case of failure.
 */
async function updateCache() {
  if (Date.now() - cache.timestamp < MAX_AGE) return;
  const upd = await fetch(`${OER_API}/latest.json?app_id=${OER_KEY}`);
  if (!upd.ok) throw new Error(upd.statusText);
  cache = await upd.json();
  cache.timestamp *= 1000; /* Timestamp in API response is in seconds. */
}

/**
 * Returns exchange rates.
 * @return {Promise} Resolves to the rates object.
 */
export default async function getExchangeRates() {
  await updateCache();
  return _.cloneDeep(cache);
}
