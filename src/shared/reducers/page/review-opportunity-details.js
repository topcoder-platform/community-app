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
    [a.togglePhasesExpand]: state => ({ ...state, phasesExpanded: !state.phasesExpanded }),
  }, _.defaults(defaultState, {
    phasesExpanded: false,
    selectedTab: TABS.APPLICATIONS,
  }));
}

export default create();
