import _ from 'lodash';
import actions, { TABS } from 'actions/page/dashboard';
import cookies from 'browser-cookies';
import { handleActions } from 'redux-actions';
import { isomorphy } from 'topcoder-react-utils';

const validTabs = new Set(_.values(TABS));

/**
 * Shows/hides announcement.
 * @param {Object} state
 * @param {Boolean} payload
 * @return {Object} New state.
 */
function onShowAnnouncement(state, { payload }) {
  if (state.showAnnouncement === payload) return state;
  return { ...state, showAnnouncement: payload };
}

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
 * @param {Object} state
 * @param {Boolean} payload `true` to show; `false` to hide.
 * @return {Object} New state
 */
function onShowEarnings(state, { payload }) {
  if (state.showEarnings === payload) return state;
  if (isomorphy.isClientSide()) {
    cookies.set('showEarningsInDashboard', JSON.stringify(payload), {
      expires: 365,
    });
  }
  return { ...state, showEarnings: payload };
}

/**
 * Shows/hides XL versions of the badges.
 * @param {Object} state
 * @param {String} payload XL badge to show.
 * @return {Object} New state.
 */
function onShowXlBadge(state, { payload }) {
  return { ...state, xlBadge: payload };
}

/**
 * Switches challenge filter.
 * @param {Object} state
 * @param {String} payload
 * @return {Object} New state.
 */
function onSwitchChallengeFilter(state, { payload }) {
  return {
    ...state,
    challengeFilter: payload,
  };
}

/**
 * Switches dash tabs.
 * @param {Object} state
 * @param {String} payload Target tab.
 * @return {Object} New state.
 */
function onSwitchTab(state, { payload }) {
  if (state.tab === payload || !validTabs.has(payload)) return state;
  return { ...state, tab: payload };
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.page.dashboard;
  return handleActions({
    [a.showAnnouncement]: onShowAnnouncement,
    [a.showChallengeFilter]: onShowChallengeFilter,
    [a.showEarnings]: onShowEarnings,
    [a.showXlBadge]: onShowXlBadge,
    [a.switchChallengeFilter]: onSwitchChallengeFilter,
    [a.switchTab]: onSwitchTab,
  }, _.defaults(state, {
    challengeFilter: '',
    tab: TABS.MY_ACTIVE_CHALLENGES,
    showAnnouncement: true,
    xlBadge: '',
  }));
}

export default create();
