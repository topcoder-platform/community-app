/**
 * Redux Reducer for state.page.challengeDetails
 *
 * Description:
 *   Implements factory for creating redux state at state.page.challengeDetails
 *   and combines with nested state.page.challengeDetails.x factories
 */

import _ from 'lodash';
import { resolveReducers, combine } from 'utils/redux';
import { handleActions } from 'redux-actions';

import submission, { factory as submissionFactory } from './submission';


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
    submission: submissionFactory(req),
  }).then(reducers => combine(create(), reducers));
}

/* Default reducer with empty initial state. */
export default combine(create(), { submission });
