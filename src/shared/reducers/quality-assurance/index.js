import { combineReducers } from 'redux';
import { resolveReducers } from 'utils/redux';

import { factory as repositoriesFactory } from './repositories';

export function factory(req) {
  return resolveReducers({
    repositories: repositoriesFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
  }));
}

export default undefined;