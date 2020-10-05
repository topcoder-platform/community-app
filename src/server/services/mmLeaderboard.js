/* eslint-disable class-methods-use-this */
/**
 * Server-side functions necessary for effective integration with MMLeaderboard
 */
import { services } from 'topcoder-react-lib';

const { api, submissions } = services;

/**
 * Auxiliary class that handles communication with MMLeaderboard
 */
export default class MMLService {
  /**
   * getLeaderboard endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async getLeaderboard(req, res, next) {
    try {
      const m2mToken = await api.getTcM2mToken();
      const ss = submissions.getService(m2mToken);
      const subs = await ss.getSubmissions({ challengeId: req.params.id });
      return res.send({
        id: req.params.id,
        subs,
      });
    } catch (err) {
      return next(err);
    }
  }
}
