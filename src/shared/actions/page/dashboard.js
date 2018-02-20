/**
 * Actions for dashboard page UI.
 */

import { createActions } from 'redux-actions';

/**
 * Payload creator for the action that shows/hides challenges filter by
 * community.
 * @param {Boolean} show
 * @return {Boolean} Payload.
 */
function showChallengesFilter(show) {
  return show;
}

/**
 * Payload creator for the action that shows/hides member earnings in
 * the dashboard.
 * @param {Boolean} show
 * @return {Boolean} Payload.
 */
function showEarnings(show) {
  return show;
}

export default createActions({
  PAGE: {
    DASHBOARD: {
      SHOW_CHALLENGE_FILTER: showChallengesFilter,
      SHOW_EARNINGS: showEarnings,
    },
  },
});
