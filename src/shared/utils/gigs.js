/**
 * Gig work utils
 */

import _ from 'lodash';

/**
 * Salary Type mapper
 * @param {Object} data the data
 */
export function getSalaryType(data) {
  switch (data.id) {
    case 1: return 'monthly';
    case 2: return 'annual';
    case 3: return 'week';
    case 4: return 'daily';
    case 5: return 'hourly';
    default: return 'n/a';
  }
}

/**
 * Custom Field mapper
 * @param {Array} data the data
 */
export function getCustomField(data, key) {
  const val = _.find(data, {
    field_name: key,
  });
  return val && val.value ? val.value : 'n/a';
}
