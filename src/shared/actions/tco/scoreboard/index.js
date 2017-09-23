/**
 * Actions for the Scoreboard.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService } from 'services/tco/scoreboard';

const service = getService();
/*
 * Retrieve the Scoreboard details
 * @param {Number|String} challengeId
 * @return {Object} the result
 */
function fetchScoreboardDone(challengeId) {
  return service.getScoreboard(challengeId);
}

export default createActions({
  SCOREBOARD: {
    FETCH_SCOREBOARD_INIT: _.noop,
    FETCH_SCOREBOARD_DONE: fetchScoreboardDone,
  },
});
