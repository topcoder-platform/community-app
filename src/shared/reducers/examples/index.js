/**
 * This module contains an example of reducer for Flux Standard Actions for
 * Redux, which should be used to update the state of Topcoder Community App.
 * For details read https://github.com/acdlite/redux-actions.
 */

import { combineReducers } from 'redux';
import { redux } from 'topcoder-react-utils';

import { factory as dataFetchFactory } from './data-fetch';

export function factory(req) {
  return redux.resolveReducers({
    dataFetch: dataFetchFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
  }));
}

export default undefined;
