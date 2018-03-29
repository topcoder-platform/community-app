/**
 * Actions for UI of Veterans - Home page.
 */

import { createActions } from 'redux-actions';

/**
 * Payload creator for the action that shows / hides the modal with
 * "What is Topcoder?" video.
 * @param {Boolean} show
 * @return {Boolean}
 */
function showWhatIsTopcoderVideo(show) {
  return Boolean(show);
}

export default createActions({
  PAGE: {
    COMMUNITIES: {
      VETERANS: {
        HOME: {
          SHOW_WHAT_IS_TOPCODER_VIDEO: showWhatIsTopcoderVideo,
        },
      },
    },
  },
});
