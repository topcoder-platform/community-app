/**
 * Server-side functions necessary for effective integration with mailchimp
 */
import fetch from 'isomorphic-fetch';

/**
 * Auxiliary class that handles communication with mailchimp
 * APIs in the same uniform manner.
 */
class MailchimpService {
  /**
   * Creates a new service instance.
   * @param {String} baseUrl The base API endpoint.
   */
  constructor(baseUrl) {
    this.private = { baseUrl };
  }

  /**
   * Gets data from the specified endpoing.
   * @param {Object} the request.
   * @return {Promise}
   */
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

/* mailchimp CDN service. */
export default new MailchimpService('https://us13.api.mailchimp.com/3.0');
