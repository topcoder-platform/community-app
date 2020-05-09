/* global window */

import ReactGA from 'react-ga';
import { config } from 'topcoder-react-utils';

const TRACKING_NAME = 'tracking';

/**
 * init - Init Google Analytics tracking
 * @param {string} userId
 */
export const init = (userId) => {
  ReactGA.initialize([{
    trackingId: config.GOOGLE_ANALYTICS_ID,
    gaOptions: {
      name: TRACKING_NAME,
      userId,
    },
  }], {
    alwaysSendToDefaultTracker: false,
  });
};

/**
 * pageView - Track page view
 */
export const pageView = () => {
  ReactGA.pageview(window.location.pathname
                   + window.location.search, [TRACKING_NAME]);
};

/**
 * event - Add custom tracking event.
 * @param {string} category
 * @param {string} action
 * @param {string} label
 */
export const event = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  }, [TRACKING_NAME]);
};

export default undefined;
