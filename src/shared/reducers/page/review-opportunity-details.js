import _ from 'lodash';
import { handleActions } from 'redux-actions';

import actions, { TABS } from 'actions/page/review-opportunity-details';

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
      .map(term => _.pick(term, ['id', 'agreed', 'title'])),
    term => term.id,
  );

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
    details: payload.details,
    isLoadingDetails: false,
    requiredTerms: buildRequiredTermsList(payload.details),
  };
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(defaultState = {}) {
  const a = actions.page.reviewOpportunityDetails;
  return handleActions({
    [a.getDetailsInit]: state => ({ ...state, isLoadingDetails: true }),
    [a.getDetailsDone]: onGetDetailsDone,
    [a.selectTab]: (state, { payload }) => ({ ...state, selectedTab: payload }),
    [a.setRoles]: (state, { payload }) => ({ ...state, selectedRoles: payload }),
    [a.toggleApplyModal]: state => ({ ...state, applyModalOpened: !state.applyModalOpened }),
    [a.togglePhasesExpand]: state => ({ ...state, phasesExpanded: !state.phasesExpanded }),
    [a.toggleRole]: (state, { payload }) => ({
      ...state,
      selectedRoles: _.xor(state.selectedRoles, [payload]),
    }),
  }, _.defaults(defaultState, {
    applyModalOpened: false,
    phasesExpanded: false,
    selectedRoles: [],
    selectedTab: TABS.APPLICATIONS,
  }));
}

export default create();
