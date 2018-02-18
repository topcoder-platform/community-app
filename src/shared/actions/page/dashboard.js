/**
 * Actions for dashboard page UI.
 */

import { createActions } from 'redux-actions';

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
      SHOW_EARNINGS: showEarnings,
    },
  },
});
