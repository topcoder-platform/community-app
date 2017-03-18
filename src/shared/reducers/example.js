/**
 * This module contains an example of reducer for Flux Standard Actions for
 * Redux, which should be used to update the state of Topcoder Community App.
 * For details read https://github.com/acdlite/redux-actions.
 */

import { combineActions, handleActions } from 'redux-actions';
import actions from '../actions/example';

export default handleActions({
  [combineActions(
    actions.example.counter.decrement,
    actions.example.counter.increment)
  ](state, action) {
    return { ...state, count: state.count + action.payload };
  },
}, {
  count: 0,
  timeout: 'Not started yet',
});
