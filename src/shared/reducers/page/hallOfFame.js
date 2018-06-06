/**
 * TCO Hall of Fame Reducers
 */
import _ from 'lodash';
import { handleActions } from 'redux-actions';

import actions from 'actions/page/hallOfFame';

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(defaultState = {}) {
  const a = actions.page.hallOfFame;
  return handleActions({
    [a.setSelectedEvent]: (state, { payload }) => ({ ...state, selectedEvent: payload }),
    [a.setSelectedEventType]: (state, { payload }) => ({ ...state, selectedEventType: payload }),
  }, _.defaults(defaultState, {
    selectedEvent: '',
    selectedEventType: '',
  }));
}

export function factory() {
  return Promise.resolve(create());
}

export default create();
