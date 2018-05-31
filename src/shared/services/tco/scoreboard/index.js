/**
 * This module provides a service to manage scoreboards via API.
 */
import { services } from 'topcoder-react-lib';
import { config } from 'topcoder-react-utils';

const Api = services.api.default;

class ScoreboardService {
  /**
   * constructor.
   */
  constructor() {
    this.private = {
      api: new Api(config.URL.COMMUNITY_API),
    };
  }

  /**
  * Retrieve a scoreboard.
  * @param {String} challengeId The challenge id.
  * @return {Object} Scoreboard service object
  */
  getScoreboard(challengeId) {
    return this.private.api.get(`/scoreboard/challenges/${challengeId}`)
      .then(res => res.json());
  }
}

/**
 * Returns a new or existing challenges service.
 * @return {ScoreboardService} Scoreboard service object
 */
let lastInstance = null;
export function getService() {
  if (!lastInstance) {
    lastInstance = new ScoreboardService();
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;
