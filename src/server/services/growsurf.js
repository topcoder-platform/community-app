/**
 * Server-side functions necessary for effective integration with growsurf
 */
import fetch from 'isomorphic-fetch';
import config from 'config';

/**
 * Auxiliary class that handles communication with growsurf
 */
export default class GrowsurfService {
  /**
   * Creates a new service instance.
   * @param {String} baseUrl The base API endpoint.
   */
  constructor(baseUrl = 'https://api.growsurf.com/v2') {
    this.private = {
      baseUrl,
      apiKey: config.SECRET.GROWSURF_API_KEY,
      authorization: `Bearer ${config.SECRET.GROWSURF_API_KEY}`,
    };
  }

  /**
   * Gets get participant by email or id.
   * @return {Promise}
   * @param {Object} req the request.
   * @param {Object} res the response.
   */
  async getParticipant(req, res) {
    const { participantId } = req.query;
    const response = await fetch(`${this.private.baseUrl}/campaign/${config.GROWSURF_CAMPAIGN_ID}/participant/${participantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.private.authorization,
      },
    });
    if (response.status >= 300) {
      res.status(response.status);
      return {
        error: await response.json(),
        code: response.status,
        url: `${this.private.baseUrl}/campaign/${config.GROWSURF_CAMPAIGN_ID}/participant/${participantId}`,
      };
    }
    const data = await response.json();
    return data;
  }

  /**
   * Add participant
   * @return {Promise}
   * @param {Object} body the request payload.
   */
  async addParticipant(body) {
    const response = await fetch(`${this.private.baseUrl}/campaign/${config.GROWSURF_CAMPAIGN_ID}/participant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.private.authorization,
      },
      body,
    });
    if (response.status >= 300) {
      return {
        error: await response.json(),
        code: response.status,
        url: `${this.private.baseUrl}/campaign/${config.GROWSURF_CAMPAIGN_ID}/participant`,
        body,
        private: this.private, // to remove in final release
      };
    }
    const data = await response.json();
    return data;
  }

  /**
   * Gets get participant by email or id
   * if not exxists create it
   * @return {Promise}
   * @param {Object} req the request.
   * @param {Object} res the response.
   */
  async getOrCreateParticipant(req, res) {
    const { body } = req;
    const result = await this.addParticipant(JSON.stringify({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
    }));
    if (result.error) {
      res.status(result.code);
    }
    return result;
  }
}
