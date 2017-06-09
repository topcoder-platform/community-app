/**
 * This module contains a reducer for tc-communities related state
 */

import { combineReducers } from 'redux';
import { resolveReducers } from 'utils/redux';

import { factory as metaFactory } from './meta';
import { factory as newsFactory } from './news';

export function factory(req) {
  return resolveReducers({
    meta: metaFactory(req),
    news: newsFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
  }));
}

export default undefined;
