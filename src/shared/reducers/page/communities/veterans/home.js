import _ from 'lodash';
import actions from 'actions/page/communities/veterans/home';
import { handleActions } from 'redux-actions';

/**
 * Shows / hides the modal with "What is Topcoder?" video.
 * @param {Object} state
 * @param {Boolean} payload
 * @return {Object} New state.
 */
function onShowWhatIsTopcoderVideo(state, { payload }) {
  return {
    ...state,
    isWhatIsTopcoderVideoShown: payload,
  };
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.page.communities.veterans.home;
  return handleActions({
    [a.showWhatIsTopcoderVideo]: onShowWhatIsTopcoderVideo,
  }, _.defaults(state, {
    isWhatIsTopcoderVideoShown: false,
  }));
}

export default create();
