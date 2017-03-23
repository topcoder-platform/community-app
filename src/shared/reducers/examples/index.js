/**
 * This module contains an example of reducer for Flux Standard Actions for
 * Redux, which should be used to update the state of Topcoder Community App.
 * For details read https://github.com/acdlite/redux-actions.
 */

import { combineReducers } from 'redux';

import { factory as dataFetchFactory } from './data-fetch';
import { resolveReducers } from '../../utils/redux';

export function factory(req) {
  return resolveReducers({
    dataFetch: dataFetchFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
  }));
}

export default undefined;
