/**
 * This module contains the root reducer of Topcoder Community App state.
 * To understand reducers read http://redux.js.org/docs/basics/Reducers.html.
 */

import { combineReducers } from 'redux';
import exampleReducer from './example';

export default combineReducers({
  example: exampleReducer,
});
