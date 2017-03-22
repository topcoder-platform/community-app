/**
 * Redux-related helpers.
 */

import _ from 'lodash';

/**
 * Given a mapping between reducer names and their promises, this function
 * waits till resolution of all promises and returns the mapping between
 * reducer names and the resolved reducers.
 * @param {Object} promises Object with promises of reducers.
 * @return Object with reducers.
 */
export function resolveReducers(promises) {
  return Promise.all(_.values(promises)).then((reducers) => {
    const map = {};
    _.keys(promises).forEach((key, index) => {
      map[key] = reducers[index];
    });
    return map;
  });
}

/* We don't any `main` function in this module to export it by default. */
export default undefined;
