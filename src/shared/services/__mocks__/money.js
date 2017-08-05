/**
 * Mock money service.
 */

import _ from 'lodash';
import fx from 'money';
import cachedRates from './data/exchange-rates.json';

if (cachedRates) {
  fx.base = cachedRates.base;
  fx.rates = cachedRates.rates;
}

export function convert(amount, to, from = 'USD') {
  return Promise.resolve(fx.convert(amount, { from, to }));
}

export function convertNow(amount, to, from = 'USD') {
  return fx.convert(amount, { from, to });
}

export function getRates() {
  return Promise.resolve(_.clone(cachedRates));
}

export function getRatesNow() {
  return _.clone(cachedRates);
}

export default undefined;
