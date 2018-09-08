/**
 * Server-side functions necessary for effective integration with mailchimp
 */
import fetch from 'isomorphic-fetch';

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
  }

  /**
   * Gets data from the specified endpoint.
   * @return {Promise}
   * @param {Object} the request.
   */

  async checkSubscription(req) {
    const url = `${this.private.baseUrl}`;
    const res = await fetch(`${url}/lists/${req.params.listId}/members/${req.params.emailHash}`, {
      method: 'GET',
      headers: {
        'Content-Type': req.headers['content-type'],
        Authorization: req.headers.authorization,
      },
    });
    return res.json();
  }

  async doRegistMember(req) {
    const url = `${this.private.baseUrl}`;
    const formData = JSON.stringify(req.body);
    const res = await fetch(`${url}/lists/${req.params.listId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'],
        Authorization: req.headers.authorization,
      },
      body: formData,
    });
    return res.json();
  }
}
