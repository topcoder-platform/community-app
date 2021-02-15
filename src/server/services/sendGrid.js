/**
 * Server-side functions necessary for sending emails via Sendgrid APIs
 */
import config from 'config';
import { logger } from 'topcoder-react-lib';
import fetch from 'isomorphic-fetch';

/**
 * Sends emails via the Sendgrid API
 * https://sendgrid.com/docs/api-reference/
 * @param {Object} req the request
 * @param {Object} res the response
 */
export const sendEmail = async (req, res) => {
  try {
    const msg = req.body;
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.SECRET.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(msg),
    });
    res.status(response.status);
    return {};
  } catch (error) {
    logger.error(error);
    const { message, code, response } = error;
    res.status(code || 500);
    if (error.response) {
      const { headers, body } = response;
      return {
        message, headers, body,
      };
    }
    return { message };
  }
};

export default undefined;
