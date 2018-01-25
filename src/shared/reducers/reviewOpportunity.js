/**
 * Reducer for state.reviewOpportunity
 */

import _ from 'lodash';
import actions from 'actions/reviewOpportunity';
import { handleActions } from 'redux-actions';
import { toFSA } from 'utils/redux';
import { getAuthTokens } from 'utils/tc';

/**
 * Handles REVIEW_OPPORTUNITY/GET_REVIEW_OPPORTUNITY_DETAILS_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetReviewOpportunityDetailsDone(state, { payload, error }) {
  if (error) {
    return {
      ...state,
      authError: true,
      isLoadingDetails: false,
    };
  }

  return {
    ...state,
    details: payload,
    isLoadingDetails: false,
  };
}

/**
 * Creates a new reducer with the specified initial state.
 * @param {Object} initialState Initial state.
 * @return reducer.
 */
function create(initialState) {
  const a = actions.reviewOpportunity;
  return handleActions({
    [a.getReviewOpportunityDetailsInit]: state => ({ ...state, isLoadingDetails: true }),
    [a.getReviewOpportunityDetailsDone]: onGetReviewOpportunityDetailsDone,
  }, _.defaults(initialState, {
    authError: false,
    details: null,
    isLoadingDetails: false,
  }));
}

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for server-side rendering). If HTTP
 * request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory(req) {
  // if (req && req.url.match(/\/review-opportunities\/\d{8}\/*$/)) {
  //   const tokens = getAuthTokens(req);
  //   const challengeId = req.url.match(/\d+/)[0];
  //   const a = actions.reviewOpportunity;
  //   return toFSA(a.getReviewOpportunityDetailsDone(challengeId, tokens.tokenV3))
  //     .then(({ payload }) => create({ details: payload }));
  // }

  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
