/**
 * Redux Reducer for state.page
 *
 * Description:
 *  Implements reducer factory for the state.page segment of Redux state; and
 *  combines it with the child state.page.x reducer factories.
 */

import { combineReducers } from 'redux';
import { resolveReducers } from 'utils/redux';

import challengeDetails, {
  factory as challengeDetailsFactory,
} from './challenge-details';

import sandbox from './sandbox';

/**
 * Reducer factory.
 * @param {Object} req ExpressJS HTTP Request.
 * @return {Function} Reducer.
 */
export function factory(req) {
  return resolveReducers({
    challengeDetails: challengeDetailsFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
    sandbox,
  }));
}

export default combineReducers({
  challengeDetails,
  sandbox,
});
