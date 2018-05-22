import _ from 'lodash';
import actions, { SPECS_TAB_STATES } from 'actions/page/challenge-details';
import { handleActions } from 'redux-actions';
import { updateQuery } from 'utils/url';

/**
 * Handles challengeActions.toggleCheckpointFeedback action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onToggleCheckpointFeedback(state, action) {
  const { payload: { id, open } } = action;
  const newCheckpointResults = _.clone(state.checkpoints.checkpointResults);
  newCheckpointResults[id].expanded = _.isUndefined(open)
    ? !newCheckpointResults[id].expanded : open;
  const newCheckpoints = {
    ...state.checkpoints,
    checkpointResults: newCheckpointResults,
  };
  return {
    ...state,
    checkpoints: newCheckpoints,
  };
}

/**
 * Handles CHALLENGE/SELECT_TAB action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onSelectTab(state, { payload }) {
  updateQuery({ tab: payload });
  return { ...state, selectedTab: payload };
}

/**
 * Handler for the SET_SPECS_TAB_STATE action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onSetSpecsTabState(state, { payload }) {
  return { ...state, specsTabState: payload };
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.page.challengeDetails;
  return handleActions({
    [a.selectedTab]: onSelectTab,
    [a.setSpecsTabState]: onSetSpecsTabState,
    [a.toggleCheckpointFeedback]: onToggleCheckpointFeedback,
  }, _.defaults(state, {
    checkpoints: {},
    specsTabState: SPECS_TAB_STATES.VIEW,
  }));
}

export default create();
