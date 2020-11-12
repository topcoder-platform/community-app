import fetch from 'isomorphic-fetch';
import { logger } from 'topcoder-react-lib';

const PROXY_ENDPOINT = '/api/mml';

export default class Service {
  baseUrl = PROXY_ENDPOINT;

  /**
   * Get MMLeaderboard by id
   * @param {*} id The request id
   */
  async getMMLeaderboard(id) {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (!res.ok) {
      const error = new Error(`Failed to get leaderboard ${id}`);
      logger.error(error, res);
    }
    return res.json();
  }
}
