/**
 * Server-side functions necessary for effective integration with mailchimp
 */
import fetch from 'isomorphic-fetch';
import config from 'config';
import qs from 'qs';

/**
 * Auxiliary class that handles communication with mailchimp
 * APIs in the same uniform manner.
 */
export default class MailchimpService {
  /**
   * Creates a new service instance.
   * @param {String} baseUrl The base API endpoint.
   */
  constructor(baseUrl) {
    this.private = { baseUrl };
    const credentials = config.SECRET.MAILCHIMP.default;
    this.mailchimpBaseUrl = credentials.MAILCHIMP_BASE_URL;
    this.apiKey = credentials.API_KEY;
    this.authorization = `Basic ${Buffer.from(`apikey:${this.apiKey}`).toString('base64')}`;
  }

  /**
   * Gets data from the specified endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async checkSubscription(req) {
    const res = await fetch(`${this.mailchimpBaseUrl}/lists/${req.params.listId}/members/${req.params.emailHash}`, {
      method: 'GET',
      headers: {
        'Content-Type': req.headers['content-type'],
        Authorization: this.authorization,
      },
    });
    return res.json();
  }

  async doRegistMember(req) {
    const formData = JSON.stringify(req.body);
    const res = await fetch(`${this.mailchimpBaseUrl}/lists/${req.params.listId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'],
        Authorization: this.authorization,
      },
      body: formData,
    });
    return res.json();
  }

  async updateMember(req) {
    const formData = JSON.stringify(req.body);
    const res = await fetch(`${this.mailchimpBaseUrl}/lists/${req.params.listId}/members/${req.params.emailHash}`, {
      method: 'PUT',
      headers: {
        'Content-Type': req.headers['content-type'],
        Authorization: this.authorization,
      },
      body: formData,
    });
    return res.json();
  }

  async subscribeTags(req) {
    const formData = JSON.stringify(req.body);
    const res = await fetch(`${this.mailchimpBaseUrl}/lists/${req.params.listId}/members/${req.params.emailHash}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'],
        Authorization: this.authorization,
      },
      body: formData,
    });
    return { status: res.status };
  }

  /**
   * Gets campaign-folders endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async getCampaignFolder(req) {
    const res = await fetch(`${this.mailchimpBaseUrl}/campaign-folders?count=500`, {
      method: 'GET',
      headers: {
        'Content-Type': req.headers['content-type'],
        Authorization: this.authorization,
      },
    });
    return res.json();
  }

  /**
   * Gets campaigns endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */
  async getCampaigns(req) {
    const res = await fetch(`${this.mailchimpBaseUrl}/campaigns?${qs.stringify(req.query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': req.headers['content-type'],
        Authorization: this.authorization,
      },
    });
    return res.json();
  }
}
