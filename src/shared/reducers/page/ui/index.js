import { combineReducers } from 'redux';

import settings from './settings';

export function factory() {
  return Promise.resolve(combineReducers({
    settings,
  }));
}

export default combineReducers({
  settings,
});
