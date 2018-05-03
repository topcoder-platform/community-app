/**
 * Reducer for state.challenge
 */

import _ from 'lodash';
import actions, { DETAIL_TABS } from 'actions/challenge';
import { getAuthTokens } from 'utils/tc';
import { updateQuery } from 'utils/url';
import { reducers } from 'topcoder-react-lib';

import { factory as smpFactory } from './my-submissions-management';

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
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for server-side rendering). If HTTP
 * request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory(req) {
  /* Server-side rendering of Submission Management Page. */

  const options = {
    auth: getAuthTokens(req),
    initialState: {},
    mergeReducers: {
      [actions.challenge.toggleCheckpointFeedback]: onToggleCheckpointFeedback,
      [actions.challenge.selectTab]: onSelectTab,
    },
  };

  if (req && req.query && req.query.tab) {
    options.initialState.selectedTab = req.query.tab;
  } else {
    options.initialState.selectedTab = DETAIL_TABS.DETAILS;
  }

  if (req && req.url.match(/^\/challenges\/\d+\/my-submissions/)) {
    const challengeId = req.url.match(/\d+/)[0];
    _.set(options, 'challenge.challengeDetails.id', challengeId);
    _.set(options, 'challenge.challengeDetails.mySubmission', true);
  } else if (req && req.url.match(/\/challenges\/\d+([?/].*)?$/)) {
    const challengeId = req.url.match(/\d+/)[0];
    _.set(options, 'challenge.challengeDetails.id', challengeId);
  }

  /* Otherwise this part of Redux state is initialized empty. */
  return smpFactory().then((smp) => {
    options.mySubmissionsManagement = smp;
    return reducers.challenge.factory(options);
  });
}

/* Default reducer with empty initial state. */
export default factory();
