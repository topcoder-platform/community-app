/**
 * Server-side functions necessary for sending emails via Sendgrid APIs
 */
import config from 'config';
import { logger } from 'topcoder-react-lib';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.SECRET.SENDGRID_API_KEY);

/**
 * Sends emails via the Sendgrid API
 * https://sendgrid.com/docs/for-developers/sending-email/quickstart-nodejs/#starting-the-project
 * @param {Object} req the request
 * @param {Object} res the response
 */
export function sendEmail(req, res) {
  const msg = req.body;
  sgMail
    .send(msg)
    .then(result => res.json(result))
    .catch((error) => {
      logger.error(error);
      const { message, code, response } = error;
      res.status(code || 500);
      if (error.response) {
        const { headers, body } = response;
        res.json({
          message, headers, body,
        });
      }
      res.json({ message });
    });
}

export default undefined;
