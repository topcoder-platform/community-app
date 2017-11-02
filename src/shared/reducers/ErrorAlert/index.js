/**
 * Redux Reducer for ErrorAlert
 *
 * Description:
 *   Implements state reducers for the ErrorAlert
 */
import { handleActions } from 'redux-actions';

import actions from 'actions/ErrorAlert';

/**
 * Creates an ErrorAlert reducer with the specified initial state.
 * @param {Array} initialState Initial state.
 * @return submission reducer.
 */
function create(initialState) {
  const a = actions.errorAlert;

  return handleActions({
    [a.clearError]: state => state.slice(1), // Remove the first element (oldest error)
    [a.newError]: (state, { payload }) =>
      [...state, { title: payload.title, details: payload.details }],
  }, initialState || []);
}

export function factory() {
  return Promise.resolve(create());
}

export default create();
