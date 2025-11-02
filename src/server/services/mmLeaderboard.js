/* eslint-disable class-methods-use-this */
/**
 * Server-side functions necessary for effective integration with MMLeaderboard
 */
import { services } from 'topcoder-react-lib';
import xss from 'xss';

const { api } = services;

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
      const sanitizedId = xss(req.params.id);
      const m2mToken = await api.getTcM2mToken();
      const v6api = api.getApi('V6', m2mToken);
      const subsRes = await v6api.get(`/submissions?challengeId=${sanitizedId}&page=1&perPage=500`);
      const json = await subsRes.json();
      const data = (json && json.data) ? json.data : [];

      // Map v6 reviewSummations into a "review" array compatible with existing client code
      const mapped = data.map(s => ({
        ...s,
        createdBy: s.submitterHandle || s.createdBy,
        review: (s.reviewSummation || []).map(rs => ({
          score: rs.aggregateScore,
          updatedAt: rs.updatedAt || rs.reviewedDate || s.updatedAt || s.submittedDate,
          createdAt: rs.createdAt || rs.reviewedDate || s.createdAt || s.submittedDate,
          createdBy: rs.createdBy,
        })),
      }));

      return res.send({
        id: sanitizedId,
        subs: mapped,
        reviewIds: [],
      });
    } catch (err) {
      return next(err);
    }
  }
}
