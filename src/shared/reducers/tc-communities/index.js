/**
 * This module contains a reducer for tc-communities related state
 */

import { combineReducers } from 'redux';
import { resolveReducers } from 'utils/redux';

import { factory as headerFactory } from './header';

export function factory(req) {
  return resolveReducers({
    header: headerFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
  }));
}

export default undefined;
