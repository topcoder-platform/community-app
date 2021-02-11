/**
 * Server-side functions necessary for sending emails via Sendgrid APIs
 */
import config from 'config';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.SECRET.SENDGRID_API_KEY);

/**
 * Sends emails via the Sendgrid API
 * https://sendgrid.com/docs/for-developers/sending-email/quickstart-nodejs/#starting-the-project
 * @param {Object} req the request
 * @param {Object} res the response
 */
export async function sendEmail(req, res) {
  const { body } = req;
  try {
    const result = await sgMail.send(body);
    if (result.status >= 300) {
      res.status(result.status);
    }
    return res.send(result);
  } catch (e) {
    res.status(500);
    return res.send({ message: e.message });
  }
}

export default undefined;
