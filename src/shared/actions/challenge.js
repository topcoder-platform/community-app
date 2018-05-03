/**
 * Challenge spcific actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { actions } from 'topcoder-react-lib';

/**
 * String values of valid tab names.
 */
export const DETAIL_TABS = {
  DETAILS: 'details',
  REGISTRANTS: 'registrants',
  CHECKPOINTS: 'checkpoints',
  SUBMISSIONS: 'submissions',
  WINNERS: 'winners',
  CHALLENGE_FORUM: 'challenge_forum',
};

/**
 * Toggles checkpoint feedback. If second argument is provided, it
 * will just open / close the checkpoint depending on its value being
 * true or false.
 * @param {Number} id
 * @param {Boolean} open
 * @return {Object}
 */
function toggleCheckpointFeedback(id, open) {
  return { id, open };
}

export default _.merge({ challenge: actions.challenge }, createActions({
  CHALLENGE: {
    SELECT_TAB: _.identity,
    TOGGLE_CHECKPOINT_FEEDBACK: toggleCheckpointFeedback,
  },
}));
