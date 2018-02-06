/**
 * Reducer for state.reviewOpportunity
 */

import _ from 'lodash';
import actions from 'actions/reviewOpportunity';
import { handleActions } from 'redux-actions';
import { toFSA } from 'utils/redux';
import { getAuthTokens } from 'utils/tc';

/**
 * Generates a list of unique terms ids required for the open review roles
 * with an agreed field
 *
 * @param {Object} details Review Opportuny details from API
 * @return {Array} List of unique terms
 */
function buildRequiredTermsList(details) {
  const roles = details.payments.map(payment => payment.role);

  const requiredTerms = _.uniqBy(
    details.challenge.terms
      // Sometimes roles such as Primary Reviewer have no directly equal
      // terms entry.  Include the plain Reviewer terms when present as a back-up.
      .filter(term => term.role === 'Reviewer' || _.includes(roles, term.role))
      .map(term => _.pick(term, ['termsOfUseId', 'agreed', 'title'])),
    term => term.termsOfUseId);

  return requiredTerms || [];
}

/**
 * Handles REVIEW_OPPORTUNITY/GET__DETAILS_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetDetailsDone(state, { payload, error }) {
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
    requiredTerms: buildRequiredTermsList(payload),
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
    [a.cancelApplicationsInit]: state => state,
    [a.cancelApplicationsDone]: state => state,
    [a.getDetailsInit]: state => ({ ...state, isLoadingDetails: true }),
    [a.getDetailsDone]: onGetDetailsDone,
    [a.submitApplicationsInit]: state => state,
    [a.submitApplicationsDone]: state => state,
  }, _.defaults(initialState, {
    authError: false,
    details: null,
    isLoadingDetails: false,
    requiredTerms: [],
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
  if (req && req.url.match(/^\/challenges\/\d{8}\/review-opportunities/)) {
    const tokens = getAuthTokens(req);
    const challengeId = req.url.match(/\d+/)[0];
    const a = actions.reviewOpportunity;
    return toFSA(a.getDetailsDone(challengeId, tokens.tokenV3))
      .then(({ error, payload }) => create({
        details: error ? null : payload,
        requiredTerms: error ? [] : buildRequiredTermsList(payload),
      }));
  }

  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
