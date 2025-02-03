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
      const subSrv = submissions.getService(m2mToken);
      const reviewIds = await subSrv.getScanReviewIds();
      const v5api = api.getApiV5(m2mToken);
      const subs = await v5api.get(`/submissions?challengeId=${req.params.id}&page=1&perPage=500`);
      return res.send({
        id: req.params.id,
        subs: await subs.json(),
        reviewIds,
      });
    } catch (err) {
      return next(err);
    }
  }
}
