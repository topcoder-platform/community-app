/**
 * This module contains a reducer for tc-communities related state
 */

import { combineReducers } from 'redux';
import { resolveReducers } from 'utils/redux';

import { factory as metaFactory } from './meta';

export function factory(req) {
  return resolveReducers({
    meta: metaFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
  }));
}

export default undefined;
