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
   * Gets participant by email or id
   * @return {Promise}
   * @param {String} idOrEmail growsurf id or email
   */
  async getParticipantByIdOREmail(idOrEmail) {
    const response = await fetch(`${this.private.baseUrl}/campaign/${config.GROWSURF_CAMPAIGN_ID}/participant/${idOrEmail}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.private.authorization,
      },
    });
    if (response.status >= 300) {
      return {
        error: await response.json(),
        code: response.status,
        url: `${this.private.baseUrl}/campaign/${config.GROWSURF_CAMPAIGN_ID}/participant/${idOrEmail}`,
      };
    }
    const data = await response.json();
    return data;
  }

  /**
   * Controller - Gets get participant by email or id
   * @return {Promise}
   * @param {Object} req the request.
   * @param {Object} res the response.
   */
  async getParticipantController(req, res) {
    const { emailOrId } = req.params;
    const growSurfData = await this.getParticipantByIdOREmail(emailOrId);
    if (growSurfData.error) {
      res.status(growSurfData.code);
    }
    return growSurfData;
  }

  /**
   * Controller - Gets get participants in the campaign
   * @return {Promise}
   * @param {Object} req the request.
   * @param {Object} res the response.
   */
  async getParticipantsController(req, res) {
    const response = await fetch(`${this.private.baseUrl}/campaign/${config.GROWSURF_CAMPAIGN_ID}/participants`, {
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
        url: `${this.private.baseUrl}/campaign/${config.GROWSURF_CAMPAIGN_ID}/participants`,
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
      };
    }
    const data = await response.json();
    return data;
  }

  /**
   * Controller - Gets get participant by email or id
   * if not exxists create it
   * @return {Promise}
   * @param {Object} req the request.
   * @param {Object} res the response.
   */
  async getOrCreateParticipantController(req, res) {
    const { body } = req;
    const result = await this.addParticipant(JSON.stringify({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      metadata: {
        tcHandle: body.tcHandle,
      },
    }));
    if (result.error) {
      res.status(result.code);
    }
    return result;
  }

  /**
   * Update participant in growSurf
   * @param {string} idOrEmail id or email
   * @param {string} body payload
   * @returns {Promise}
   */
  async updateParticipant(idOrEmail, body) {
    const response = await fetch(`${this.private.baseUrl}/campaign/${config.GROWSURF_CAMPAIGN_ID}/participant/${idOrEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.private.authorization,
      },
      body: JSON.stringify(body),
    });
    if (response.status >= 300) {
      return {
        error: await response.json(),
        code: response.status,
        url: `${this.private.baseUrl}/campaign/${config.GROWSURF_CAMPAIGN_ID}/participant/${idOrEmail}`,
        body,
      };
    }
    const data = await response.json();
    return data;
  }

  /**
   * Controller - update participant in the system
   * @param {Object} req request
   * @param {Object} res respons
   */
  async updateParticipantController(req, res) {
    const { emailOrId } = req.params;
    const updateGrowRes = await this.updateParticipant(emailOrId, req.body);
    if (updateGrowRes.error) {
      res.status(updateGrowRes.code);
    }
    return updateGrowRes;
  }
}
