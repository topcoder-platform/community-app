import _ from 'lodash';
import { handleActions } from 'redux-actions';

import actions, { TABS } from 'actions/page/review-opportunity-details';

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(defaultState = {}) {
  const a = actions.page.reviewOpportunityDetails;
  return handleActions({
    [a.selectTab]: (state, { payload }) => ({ ...state, selectedTab: payload }),
    [a.setRoles]: (state, { payload }) => ({ ...state, selectedRoles: payload }),
    [a.toggleApplyModal]: state => ({ ...state, applyModalOpened: !state.applyModalOpened }),
    [a.togglePhasesExpand]: state => ({ ...state, phasesExpanded: !state.phasesExpanded }),
    [a.toggleRole]: (state, { payload }) =>
      ({ ...state, selectedRoles: _.xor(state.selectedRoles, [payload]) }),
  }, _.defaults(defaultState, {
    applyModalOpened: false,
    phasesExpanded: false,
    selectedRoles: [],
    selectedTab: TABS.APPLICATIONS,
  }));
}

export default create();
