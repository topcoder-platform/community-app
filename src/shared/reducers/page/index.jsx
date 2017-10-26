/**
 * Redux Reducer for state.page
 *
 * Description:
 *   Implements factory for creating redux state at state.page
 *   and combines with nested state.page.x factories
 */
import _ from 'lodash';
import { resolveReducers, combine } from 'utils/redux';
import { handleActions } from 'redux-actions';

import challengeDetails, { factory as challengeDetailsFactory } from './challenge-details';


/**
 * Creates a new page reducer with the specified initial state.
 * @param {Object} initialState Initial state.
 * @return submission reducer.
 */
function create(initialState) {
  return handleActions({}, _.defaults(initialState, {}));
}

export function factory(req) {
  return resolveReducers({
    challengeDetails: challengeDetailsFactory(req),
  }).then(reducers => combine(create(), reducers));
}

/* Default reducer with empty initial state. */
export default combine(create(), { challengeDetails });
