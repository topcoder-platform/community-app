/**
 * Redux-related helpers.
 */

import _ from 'lodash';

/**
 * Given any Flux Standard Action (FSA) with promise as the payload, it returns
 * a promise which resolves into the FSA result object.
 * @param {Object} action
 * @return Promise which resolves to the operation result.
 */
export function toFSA(action) {
  return action.payload.then(data => ({
    ...action,
    payload: data,
  }), error => ({
    ...action,
    payload: error,
    error: true,
  }));
}

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
