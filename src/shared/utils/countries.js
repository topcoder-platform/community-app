/**
 * Provides lookup data for countryies.
 */
import _ from 'lodash';

import countryUtil from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';

countryUtil.registerLocale(enCountries);

const countries = [];

_.forIn(countryUtil.getNames('en'), (name, alpha2) => {
  countries.push({ name, alpha3: countryUtil.alpha2ToAlpha3(alpha2) });
});

export function getCountryObjFromAlpha3(alpha3) {
  if (!alpha3) {
    return null;
  }
  const name = countryUtil.getName(alpha3, 'en');
  if (!name) {
    return null;
  }
  return { name, alpha3 };
}

export function getAllCountryObjects() {
  return countries;
}
