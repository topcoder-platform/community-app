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
  }, _.defaults(defaultState, {
    selectedEvent: '',
  }));
}

export function factory(req) {
  // Check to see if a specific event is provided as a param
  if (req && req.url.match(/^\/tco-hall-of-fame\/\d{2}\/?/)) {
    const eventId = req.url.match(/\d{2}/)[0];
    return Promise.resolve(create({
      selectedEvent: eventId,
    }));
  }

  return Promise.resolve(create());
}

export default create();
