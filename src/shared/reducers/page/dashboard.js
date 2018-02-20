import actions from 'actions/page/dashboard';
import cookies from 'browser-cookies';
import { isClientSide } from 'utils/isomorphy';
import { handleActions } from 'redux-actions';

/**
 * Shows/hides challenge filter by community.
 * @param {Object} state
 * @param {Boolean} payload `true` to show; `false` to hide.
 * @return {Object} New state.
 */
function onShowChallengeFilter(state, { payload }) {
  if (state.showChallengeFilter === payload) return state;
  return { ...state, showChallengeFilter: payload };
}

/**
 * Shows/hides member earnings in the dashboard.
 * @param {*} state
 * @param {Boolean} payload `true` to show; `false` to hide.
 * @return {Object} New state
 */
function onShowEarnings(state, { payload }) {
  if (state.showEarnings === payload) return state;
  if (isClientSide()) {
    cookies.set('showEarningsInDashboard', JSON.stringify(payload));
  }
  return { ...state, showEarnings: payload };
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.page.dashboard;
  return handleActions({
    [a.showChallengeFilter]: onShowChallengeFilter,
    [a.showEarnings]: onShowEarnings,
  }, state);
}

export default create();
